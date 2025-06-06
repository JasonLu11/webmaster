import express from 'express';
import { Borrow } from '../models/borrow.model';
import { Book } from '../models/book.model';
import { auth, adminAuth, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router();

// 获取所有借阅记录（管理员）
router.get('/', adminAuth, async (req: AuthRequest, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query: any = {};

    if (status) {
      query.status = status;
    }

    const borrows = await Borrow.find(query)
      .populate('user', 'username email')
      .populate('book', 'title author isbn')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await Borrow.countDocuments(query);

    res.json({
      borrows,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ error: '获取借阅记录失败' });
  }
});

// 获取用户的借阅记录
router.get('/my-borrows', auth, async (req: AuthRequest, res) => {
  try {
    const borrows = await Borrow.find({ user: req.user?._id })
      .populate('book', 'title author isbn')
      .sort({ createdAt: -1 });
    res.json(borrows);
  } catch (error) {
    res.status(500).json({ error: '获取借阅记录失败' });
  }
});

// 申请借阅
router.post('/', auth, async (req: AuthRequest, res) => {
  try {
    const { bookId, dueDate } = req.body;

    // 检查图书是否存在且有库存
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: '图书不存在' });
    }
    if (book.availableCopies <= 0) {
      return res.status(400).json({ error: '图书已无库存' });
    }

    // 检查是否已有未完成的借阅
    const existingBorrow = await Borrow.findOne({
      user: req.user?._id,
      book: bookId,
      status: { $in: ['pending', 'approved'] },
    });

    if (existingBorrow) {
      return res.status(400).json({ error: '您已借阅此书' });
    }

    // 创建借阅记录
    const borrow = new Borrow({
      user: req.user?._id,
      book: bookId,
      dueDate,
    });

    await borrow.save();
    res.status(201).json(borrow);
  } catch (error) {
    res.status(400).json({ error: '申请借阅失败' });
  }
});

// 审核借阅申请（管理员）
router.put('/:id/approve', adminAuth, async (req: AuthRequest, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id);
    if (!borrow) {
      return res.status(404).json({ error: '借阅记录不存在' });
    }

    if (borrow.status !== 'pending') {
      return res.status(400).json({ error: '该借阅申请已处理' });
    }

    // 更新图书库存
    const book = await Book.findById(borrow.book);
    if (!book) {
      return res.status(404).json({ error: '图书不存在' });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({ error: '图书已无库存' });
    }

    book.availableCopies -= 1;
    await book.save();

    // 更新借阅状态
    borrow.status = 'approved';
    await borrow.save();

    res.json(borrow);
  } catch (error) {
    res.status(400).json({ error: '审核借阅申请失败' });
  }
});

// 拒绝借阅申请（管理员）
router.put('/:id/reject', adminAuth, async (req: AuthRequest, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id);
    if (!borrow) {
      return res.status(404).json({ error: '借阅记录不存在' });
    }

    if (borrow.status !== 'pending') {
      return res.status(400).json({ error: '该借阅申请已处理' });
    }

    borrow.status = 'rejected';
    await borrow.save();

    res.json(borrow);
  } catch (error) {
    res.status(400).json({ error: '拒绝借阅申请失败' });
  }
});

// 归还图书
router.put('/:id/return', auth, async (req: AuthRequest, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id);
    if (!borrow) {
      return res.status(404).json({ error: '借阅记录不存在' });
    }

    if (borrow.status !== 'approved') {
      return res.status(400).json({ error: '该借阅记录状态不正确' });
    }

    // 更新图书库存
    const book = await Book.findById(borrow.book);
    if (!book) {
      return res.status(404).json({ error: '图书不存在' });
    }

    book.availableCopies += 1;
    await book.save();

    // 更新借阅状态
    borrow.status = 'returned';
    borrow.returnDate = new Date();
    await borrow.save();

    res.json(borrow);
  } catch (error) {
    res.status(400).json({ error: '归还图书失败' });
  }
});

export const borrowRouter = router; 
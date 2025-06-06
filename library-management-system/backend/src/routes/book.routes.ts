import express from 'express';
import { Book } from '../models/book.model';
import { auth, adminAuth } from '../middleware/auth.middleware';

const router = express.Router();

// 获取所有图书
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category } = req.query;
    const query: any = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      query.category = category;
    }

    const books = await Book.find(query)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await Book.countDocuments(query);

    res.json({
      books,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ error: '获取图书列表失败' });
  }
});

// 获取单本图书
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: '图书不存在' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: '获取图书详情失败' });
  }
});

// 创建图书（仅管理员）
router.post('/', adminAuth, async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: '创建图书失败' });
  }
});

// 更新图书（仅管理员）
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!book) {
      return res.status(404).json({ error: '图书不存在' });
    }
    res.json(book);
  } catch (error) {
    res.status(400).json({ error: '更新图书失败' });
  }
});

// 删除图书（仅管理员）
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ error: '图书不存在' });
    }
    res.json({ message: '图书删除成功' });
  } catch (error) {
    res.status(500).json({ error: '删除图书失败' });
  }
});

export const bookRouter = router; 
import express, { Request } from 'express';
import { User } from '../models/user.model';
import { auth, adminAuth } from '../middleware/auth.middleware';

interface AuthRequest extends Request {
  user?: any;
}

const router = express.Router();

// 获取所有用户（仅管理员）
router.get('/', adminAuth, async (req: AuthRequest, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query: any = {};

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ error: '获取用户列表失败' });
  }
});

// 获取单个用户信息
router.get('/:id', auth, async (req: AuthRequest, res) => {
  try {
    // 只允许用户查看自己的信息或管理员查看任何用户
    if (req.user?._id.toString() !== req.params.id && req.user?.role !== 'admin') {
      return res.status(403).json({ error: '无权访问' });
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: '获取用户信息失败' });
  }
});

// 更新用户信息
router.put('/:id', auth, async (req: AuthRequest, res) => {
  try {
    // 只允许用户更新自己的信息或管理员更新任何用户
    if (req.user?._id.toString() !== req.params.id && req.user?.role !== 'admin') {
      return res.status(403).json({ error: '无权访问' });
    }

    const updates = req.body;
    delete updates.password; // 不允许通过此接口修改密码
    delete updates.role; // 不允许通过此接口修改角色

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: '更新用户信息失败' });
  }
});

// 删除用户（仅管理员）
router.delete('/:id', adminAuth, async (req: AuthRequest, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }
    res.json({ message: '用户删除成功' });
  } catch (error) {
    res.status(500).json({ error: '删除用户失败' });
  }
});

// 修改用户角色（仅管理员）
router.put('/:id/role', adminAuth, async (req: AuthRequest, res) => {
  try {
    const { role } = req.body;
    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ error: '无效的角色' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: '修改用户角色失败' });
  }
});

export const userRouter = router; 
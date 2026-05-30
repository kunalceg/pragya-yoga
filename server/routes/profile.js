// Protected profile route
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      name: user.name,
      email: user.email,
      logo: user.logo || null,
      stats: {
        classes: user.classes || 0,
        months: user.months || 0,
        certifs: user.certifs || 0
      },
      progress: user.progress || {
        flexibility: 0,
        strength: 0,
        breathing: 0,
        meditation: 0
      },
      badges: user.badges || []
    });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

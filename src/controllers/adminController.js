export const getAdmin = async (req, res) => {
  try {
    res.status(200).json({
      message: "Admin is logged in",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

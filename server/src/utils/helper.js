const createSlug = (string) =>
  string
    .normalize("NFD")
    .replace(/Đ/g, "D")
    .replace(/đ/g, "d")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s-|&/g, "")
    .replace(/\s+/g, " ")
    .split(" ")
    .join("-");

const categories = [
  {
    id: 1,
    categoryName: "Đồ Chơi - Mẹ & Bé",
  },
  {
    id: 2,
    categoryName: "Điện Thoại - Máy Tính Bảng",
  },
  {
    id: 3,
    categoryName: "NGON",
  },
  {
    id: 4,
    categoryName: "Làm Đẹp - Sức Khỏe",
  },
  {
    id: 5,
    categoryName: "Điện Gia Dụng",
  },
  {
    id: 6,
    categoryName: "Thời trang nữ",
  },
  {
    id: 7,
    categoryName: "Thời trang nam",
  },
  {
    id: 8,
    categoryName: "Giày - Dép nữ",
  },
  {
    id: 9,
    categoryName: "Túi thời trang nữ",
  },
  {
    id: 10,
    categoryName: "Giày - Dép nam",
  },
  {
    id: 11,
    categoryName: "Túi thời trang nam",
  },
  {
    id: 12,
    categoryName: "Balo và Vali",
  },
  {
    id: 13,
    categoryName: "Phụ kiện thời trang",
  },
  {
    id: 14,
    categoryName: "Đồng hồ và Trang sức",
  },
  {
    id: 14,
    categoryName: "Laptop - Máy Vi Tính - Linh kiện",
  },
  {
    id: 15,
    categoryName: "Nhà Cửa - Đời Sống",
  },
  {
    id: 16,
    categoryName: "Cross Border - Hàng Quốc Tế",
  },
  {
    id: 17,
    categoryName: "Bách Hóa Online",
  },
  {
    id: 18,
    categoryName: "Thiết Bị Số - Phụ Kiện Số",
  },
  {
    id: 19,
    categoryName: "Voucher - Dịch vụ",
  },
  {
    id: 20,
    categoryName: "Ô Tô - Xe Máy - Xe Đạp",
  },
  {
    id: 21,
    categoryName: "Nhà Sách Tiki",
  },
  {
    id: 22,
    categoryName: "Điện Tử - Điện Lạnh",
  },
  {
    id: 23,
    categoryName: "Thể Thao - Dã Ngoại",
  },
  {
    id: 24,
    categoryName: "Máy Ảnh - Máy Quay Phim",
  },
  {
    id: 25,
    categoryName: "Sản phẩm Tài chính - Bảo hiểm",
  },
];
const createSlugCategories = (name) => {
  const array = [];
  for (let category of categories) {
    if (category.categoryName === name) {
      array.push(createSlug(category.categoryName));
    }
  }
  return array;
};

module.exports = {
  createSlug,
  createSlugCategories,
  categories,
};

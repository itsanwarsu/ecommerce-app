export default function initAdmin() {
  const users = JSON.parse(
    localStorage.getItem("users")
  ) || [];

  const superAdminExist = users.some(
    (user) => user.role === "superadmin"
  );

  if (!superAdminExist) {
    const superAdmin = {
      _id: 0,
      name: "Super Admin",
      email: "admin@gmail.com",
      password: "admin123",
      role: "superadmin",
    };

    users.push(superAdmin);

    localStorage.setItem(
      "users",
      JSON.stringify(users)
    );

    console.log("Super Admin berhasil dibuat");
  }
}

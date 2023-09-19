const normalizeUser = (userData) => {
  // If userData is undefined, return an empty object or a default value
  if (!userData) return {};

  if (!userData.image) {
    userData.image = {};
  }
  userData.image = {
    url: userData.image.url || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    alt: userData.image.alt || "loading..",
  };

  // Check if userData.address is undefined before trying to access its properties
  let address = {
    state: "",
    country: "",
    city: "",
    street: "",
    houseNumber: "",
    zip: "",
  };
  if (userData.address) {
    address = {
      state: userData.address.state || "",
      country: userData.address.country || "",
      city: userData.address.city || "",
      houseNumber: userData.address.houseNumber || "",
      street: userData.address.street || "",
      zip: userData.address.zip || "",
    };
  }

  return {
    name: {
      firstName: userData.name?.firstName || "",
      lastName: userData.name?.lastName || "",
    },
    phoneNumber: userData.phoneNumber || "",
    email: userData.email || "",
    password: userData.password || "",
    image: userData.image,
    address: address,
    gender: userData.gender || "",
    followers: userData.followers || [],
    following: userData.following || [],
    isAdmin: userData.isAdmin || false,
    lastLoginTime: userData.lastLoginTime || "",
  };
};

module.exports = normalizeUser;

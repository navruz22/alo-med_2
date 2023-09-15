export const checkClientData = (client, t) => {
  if (!client.fullname) {
    return {
      title: t("Diqqat! Mijoz ismi kiritilmagan."),
      description: "",
      status: "error",
    };
  }

  if (!client.brondate) {
    return {
      title: t("Diqqat! Mijozning tug'ilgan sanasi kiritilmagan."),
      description: "",
      status: "error",
    };
  }

  if (client.phone && client.phone.length !== 9) {
    return {
      title: t("Diqqat! Mijoz telefon raqami 9 raqamdan iborat bo'lishi kerak."),
      description: "",
      status: "error",
    };
  }

  return false;
};


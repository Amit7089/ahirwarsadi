const PREMIUM_PLANS = ["Silver", "Gold"];

export const isMembershipActive = (user) => {
  if (!user) {
    return false;
  }

  if (!PREMIUM_PLANS.includes(user.membershipPlan)) {
    return false;
  }

  if (user.membershipStatus !== "Active") {
    return false;
  }

  if (!user.membershipExpiryDate) {
    return false;
  }

  const now = new Date();
  const expiryDate = new Date(user.membershipExpiryDate);

  return expiryDate > now;
};

export const getMembershipAccess = (user) => {
  const active = isMembershipActive(user);

  if (!active) {
    return {
      isActive: false,
      plan: "Free",
      isSilver: false,
      isGold: false,
    };
  }

  return {
    isActive: true,
    plan: user.membershipPlan,
    isSilver: user.membershipPlan === "Silver",
    isGold: user.membershipPlan === "Gold",
  };
};

export const isMembershipExpired = (user) => {
  if (!user) {
    return false;
  }

  if (!PREMIUM_PLANS.includes(user.membershipPlan)) {
    return false;
  }

  if (!user.membershipExpiryDate) {
    return true;
  }

  return new Date(user.membershipExpiryDate) <= new Date();
};

export const syncMembershipStatus = async (user) => {
  if (!user) {
    return user;
  }

  if (
    PREMIUM_PLANS.includes(user.membershipPlan) &&
    isMembershipExpired(user)
  ) {
    user.membershipStatus = "Expired";
    await user.save();
  }

  return user;
};
/**
 * Convert Staff template data shape to a tree consumable by OrgChart
 */
export function staffToTree(staff) {
  const root = {
    id: "root",
    name: staff?.ceo?.name || "CEO",
    title: staff?.ceo?.position || "",
    children: [],
  };
  if (Array.isArray(staff?.managers) && staff.managers.length) {
    root.children.push({
      id: "managers",
      name: "Managers",
      title: "",
      children: staff.managers.map((m, i) => ({
        id: `mgr-${i}`,
        name: m.name,
        title: m.position,
      })),
    });
  }
  if (Array.isArray(staff?.staff) && staff.staff.length) {
    root.children.push({
      id: "staff",
      name: "Staff",
      children: staff.staff.map((s, i) => ({
        id: `s-${i}`,
        name: s.name,
        title: s.position,
      })),
    });
  }
  if (Array.isArray(staff?.juniorStaff) && staff.juniorStaff.length) {
    root.children.push({
      id: "junior",
      name: "Junior Staff",
      children: staff.juniorStaff.map((s, i) => ({
        id: `j-${i}`,
        name: s.name,
        title: s.position,
      })),
    });
  }
  return root;
}

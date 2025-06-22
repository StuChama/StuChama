const BASE_URL = process.env.REACT_APP_BACKEND_URL;

// Fetch all chama groups
export const fetchGroups = async () => {
  const res = await fetch(`${BASE_URL}/api/chamas/groups`);
  if (!res.ok) throw new Error('Failed to fetch groups');
  return await res.json();
};

// Fetch user's role in a specific chama
export const fetchUserMembership = async (groupId, userId) => {
  const res = await fetch(`${BASE_URL}/api/chamas/groups/${groupId}/members/${userId}`);
  if (!res.ok) return [];
  const member = await res.json();
  return member ? [member] : [];
};


export const fetchUserChamas = async (userId) => {
  const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chamas/user/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch user chamas');
  return await res.json();
};


// Create a new chama
export const createGroup = async (groupData) => {
  const res = await fetch(`${BASE_URL}/api/chamas/groups`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(groupData),
  });
  if (!res.ok) throw new Error('Failed to create group');
  return await res.json();
};

// Join an existing chama
export const joinGroup = async (membershipData) => {
  const res = await fetch(`${BASE_URL}/api/chamas/group_members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(membershipData),
  });
  if (!res.ok) throw new Error('Failed to join group');
  return await res.json();
};

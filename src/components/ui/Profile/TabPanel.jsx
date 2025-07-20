export default function TabPanel({ id, activeTab, children }) {
  if (activeTab !== id) return null;
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      {children}
    </div>
  );
}

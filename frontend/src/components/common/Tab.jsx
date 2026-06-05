// src/components/common/Tab.jsx

// SRP: This component's ONLY job is to render a toggle switch.
export default function Tab({ tabData, field, setField }) {
  return (
    <div className="flex bg-richblack-800 p-1 gap-x-1 my-6 rounded-full max-w-max border-b border-b-richblack-600">
      {tabData.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setField(tab.type)}
          className={`${
            field === tab.type
              ? "bg-richblack-900 text-richblack-5"
              : "bg-transparent text-richblack-200 hover:bg-richblack-900 hover:text-richblack-50"
          } py-2 px-5 rounded-full transition-all duration-200`}
        >
          {tab?.tabName}
        </button>
      ))}
    </div>
  );
}

"use client";

import { FaSprayCan, FaTint, FaSeedling, FaBookOpen } from "react-icons/fa";

const GuidancePage = () => {
  const guidanceSections = [
    {
      icon: <FaSprayCan className="text-blue-500 text-3xl" />,
      title: "Pesticide Usage",
      content: "Use pesticides judiciously. Always follow label instructions, apply during recommended times, and consider organic alternatives. Rotate pesticides to prevent resistance and protect beneficial insects.",
    },
    {
      icon: <FaTint className="text-blue-500 text-3xl" />,
      title: "Water Conservation",
      content: "Implement drip irrigation, mulch to retain soil moisture, and water during cooler parts of the day. Collect rainwater and monitor soil moisture to avoid overwatering.",
    },
    {
      icon: <FaSeedling className="text-green-500 text-3xl" />,
      title: "Growing Crops",
      content: "Prepare soil properly, plant at correct depths and spacing, provide adequate nutrients, and monitor for pests and diseases. Crop rotation helps maintain soil health and reduce pest problems.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="text-center mb-12">
        <FaBookOpen className="text-green-500 text-5xl mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-4">Farming Guidance</h1>
        <p className="text-lg text-gray-600">
          Essential tips and best practices for sustainable and productive farming.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {guidanceSections.map((section, index) => (
          <div key={index} className="glass p-6 rounded-2xl text-center transition-all duration-300 shadow-lg hover:shadow-xl">
            <div className="mb-4 flex justify-center">{section.icon}</div>
            <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
            <p className="text-gray-600">{section.content}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-gray-600">
          For more detailed guidance, consult local agricultural extension services or experts.
        </p>
      </div>
    </div>
  );
};

export default GuidancePage;

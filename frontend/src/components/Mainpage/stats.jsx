import React from "react";

const stats = [
  { value: "0", label: "Offres d’emploi en ligne" },
  { value: "0", label: "Opportunités emploi en ligne" },
  { value: "0", label: "Recruteurs actifs" },
  { value: "0", label: "Nombre d’inscrits" },
  { value: "0", label: "CVs ouverts sur les 30 derniers jours" },
];

const StatsSection = () => {
  return (
    <section className="py-12 bg-white text-center">
      <h2 className="text-3xl font-bold mb-8">Nos derniers chiffres</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
        {stats.map((stat, index) => (
          <div key={index}>
            <p className="text-pink-600 text-4xl font-bold">{stat.value}</p>
            <p className="text-gray-700 mt-2">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;

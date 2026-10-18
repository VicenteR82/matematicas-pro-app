import React from 'react';
import { Check, Star, ArrowRight } from 'lucide-react';
import { ClassPackage } from '../types';

interface PackagesSectionProps {
  packages: ClassPackage[];
  currencySymbol: string;
  onSelectPackage: (pkg: ClassPackage) => void;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({
  packages,
  currencySymbol,
  onSelectPackage,
}) => {
  return (
    <section id="planes" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-2">
            Planes Flexibles & Precios Transparentes
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Elige el formato de clase que mejor se adapta a tus metas
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Desde una sesión para despejar dudas puntuales hasta planes mensuales de alto rendimiento.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {packages.map((pkg) => {
            const isPopular = pkg.popular;
            return (
              <div
                key={pkg.id}
                className={`flex flex-col justify-between rounded-xl p-6 transition-all duration-200 ${
                  isPopular
                    ? 'bg-white border-2 border-indigo-600 shadow-md relative'
                    : 'bg-white border border-slate-200 hover:border-slate-300'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                    Más Solicitado
                  </div>
                )}

                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 min-h-[36px]">
                      {pkg.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mb-6 pb-4 border-b border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-slate-900 font-mono">
                        {currencySymbol}{pkg.price}
                      </span>
                      <span className="text-xs text-slate-500">
                        {pkg.totalClasses > 1 ? `por ${pkg.totalClasses} clases` : '/ sesión'}
                      </span>
                    </div>
                    {pkg.discountPercentage && (
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block mt-1">
                        Ahorro del {pkg.discountPercentage}%
                      </span>
                    )}
                    <div className="text-xs text-slate-500 mt-1">
                      <span>{pkg.durationMinutes} min por clase</span>
                    </div>
                  </div>

                  {/* Features list */}
                  <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => onSelectPackage(pkg)}
                  className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    isPopular
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <span>Reservar este Plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

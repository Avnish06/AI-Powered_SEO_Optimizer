import React from 'react';
import Skeleton from './Skeleton';

export default function LighthouseSkeleton() {
  return (
    <div className="space-y-6">
      {/* Grade + Scores row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grade card */}
        <div className="glass rounded-3xl p-10 flex flex-col items-center justify-center text-center h-[280px]">
          <Skeleton width={100} height={100} className="mb-6" />
          <Skeleton width={150} height={28} className="mb-2" />
          <Skeleton width={180} height={16} />
        </div>

        {/* Score rings */}
        <div className="lg:col-span-2 glass rounded-3xl p-8">
          <Skeleton width={200} height={24} className="mb-10" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <Skeleton width={80} height={80} circle className="mb-4" />
                <Skeleton width={80} height={14} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Web Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <Skeleton width={40} height={12} className="mb-2" />
                <Skeleton width={100} height={36} />
              </div>
              <Skeleton width={60} height={20} className="rounded-full" />
            </div>
            <Skeleton width="100%" height={14} />
          </div>
        ))}
      </div>

      {/* Audit Opportunities */}
      <div className="glass rounded-3xl p-8">
        <Skeleton width={200} height={24} className="mb-8" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl gap-3 border border-[var(--border-color)]">
              <div className="flex items-start gap-4 w-full">
                <Skeleton width={36} height={36} className="rounded-xl flex-shrink-0" />
                <div className="w-full">
                  <Skeleton width="60%" height={18} className="mb-2" />
                  <Skeleton width="80%" height={14} />
                </div>
              </div>
              <Skeleton width={100} height={14} className="flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

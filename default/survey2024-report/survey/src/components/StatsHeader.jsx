function StatsHeader({ metadata }) {
  const stats = [
    { label: '総回答数', value: metadata.total_responses, color: 'bg-blue-500' },
    { label: 'サイトメンバー', value: metadata.members, color: 'bg-green-500' },
    { label: '非メンバー', value: metadata.non_members, color: 'bg-orange-500' },
  ]

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-gray-50 rounded-lg p-6 text-center">
              <div className={`w-12 h-12 ${stat.color} rounded-full mx-auto mb-3 opacity-10`} />
              <div className="text-3xl font-bold text-gray-800">{stat.value.toLocaleString()}</div>
              <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StatsHeader

import { useState } from 'react'
import ChartWrapper from './ChartWrapper'
import StatsDisplay from './StatsDisplay'

function QuestionCard({ qid, qdata }) {
  const [selectedAudience, setSelectedAudience] = useState('all')

  const availableAudiences = Object.keys(qdata.results)

  const getAudienceBadge = () => {
    if (qdata.audience === 'members_only') {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
          メンバー限定
        </span>
      )
    }
    if (qdata.audience === 'non_members_only') {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
          非メンバー限定
        </span>
      )
    }
    return null
  }

  if (qdata.type === 'TEXT' || qdata.type === 'PARAGRAPH_TEXT') {
    return null
  }

  const currentResult = qdata.results[selectedAudience] || qdata.results[availableAudiences[0]]

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{qdata.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-500">{qdata.section}</span>
              {getAudienceBadge()}
            </div>
          </div>
        </div>
      </div>

      {availableAudiences.length > 1 && (
        <div className="flex border-b">
          {availableAudiences.includes('all') && (
            <button
              type="button"
              onClick={() => setSelectedAudience('all')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                selectedAudience === 'all'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              全体
            </button>
          )}
          {availableAudiences.includes('members') && (
            <button
              type="button"
              onClick={() => setSelectedAudience('members')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                selectedAudience === 'members'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              メンバー
            </button>
          )}
          {availableAudiences.includes('non_members') && (
            <button
              type="button"
              onClick={() => setSelectedAudience('non_members')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                selectedAudience === 'non_members'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              非メンバー
            </button>
          )}
        </div>
      )}

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="relative">
              <ChartWrapper
                qid={qid}
                qdata={qdata}
                result={currentResult}
                audience={selectedAudience}
              />
              {currentResult?.type === 'multiple_choice' && (
                <div className="md:hidden absolute bottom-2 right-2 text-xs text-gray-500 bg-white/90 px-2 py-1 rounded-md shadow-sm">
                  ← スクロール →
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <StatsDisplay result={currentResult} qdata={qdata} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuestionCard

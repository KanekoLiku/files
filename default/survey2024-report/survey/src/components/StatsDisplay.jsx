function StatsDisplay({ result }) {
	const formatNumber = (num) => {
		if (num === Math.floor(num)) {
			return num.toString();
		}
		return num.toFixed(2);
	};

	if (result.type === "scale") {
		return (
			<div className="bg-gray-50 rounded-lg p-4">
				<h4 className="font-semibold text-gray-900 mb-3">統計情報</h4>
				<div className="space-y-2 text-sm">
					<div className="flex justify-between">
						<span className="text-gray-600">回答数:</span>
						<span className="font-medium">{result.total_responses}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-gray-600">平均値:</span>
						<span className="font-medium">{formatNumber(result.average)}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-gray-600">中央値:</span>
						<span className="font-medium">{formatNumber(result.median)}</span>
					</div>
				</div>
			</div>
		);
	}

	if (result.type === "single_choice" || result.type === "multiple_choice") {
		const isSingleChoice = result.type === "single_choice";
		let total = isSingleChoice
			? result.total_responses
			: result.total_respondents;
		const displayLabel = isSingleChoice ? "回答数:" : "回答者数:";

		let counts = result.counts;
		if (counts && typeof counts === "object") {
			const keys = Object.keys(counts);
			if (keys.length === 1 && counts[keys[0]] && counts[keys[0]].counts) {
				const nestedData = counts[keys[0]];
				counts = nestedData.counts;
				if (nestedData.total_responses) {
					total = nestedData.total_responses;
				} else if (nestedData.total_respondents) {
					total = nestedData.total_respondents;
				}
			}
		}

		const topItems = Object.entries(counts || {})
			.filter(([, value]) => typeof value === "number")
			.sort(([, a], [, b]) => b - a)
			.slice(0, 3);

		return (
			<div className="bg-gray-50 rounded-lg p-4">
				<h4 className="font-semibold text-gray-900 mb-3">統計情報</h4>
				<div className="space-y-2 text-sm">
					<div className="flex justify-between">
						<span className="text-gray-600">{displayLabel}</span>
						<span className="font-medium">{total || 0}</span>
					</div>

					{topItems.length > 0 && (
						<>
							<div className="pt-2 mt-2 border-t border-gray-200">
								<div className="text-gray-600 font-medium mb-2">上位回答:</div>
							</div>
							{topItems.map(([item, count], index) => {
								const percentage =
									total > 0 ? ((count / total) * 100).toFixed(1) : 0;
								return (
									<div key={item} className="pl-2">
										<div className="text-gray-700">
											{index + 1}. {item}
										</div>
										<div className="text-gray-500 text-xs">
											{count} ({percentage}%)
											{result.type === "multiple_choice" && " の回答者が選択"}
										</div>
									</div>
								);
							})}
						</>
					)}
				</div>
			</div>
		);
	}

	if (result.type === "grid") {
		const rows = Object.entries(result.rows || {});

		if (rows.length === 0) {
			return null;
		}

		return (
			<div className="bg-gray-50 rounded-lg p-4">
				<h4 className="font-semibold text-gray-900 mb-3">統計情報（各項目）</h4>
				<div className="space-y-3 text-sm">
					{rows.map(([rowLabel, rowData]) => (
						<div
							key={rowLabel}
							className="pb-3 border-b border-gray-200 last:border-0"
						>
							<div className="font-medium text-gray-700 mb-1">{rowLabel}</div>
							<div className="pl-2 space-y-1">
								<div className="flex justify-between">
									<span className="text-gray-600">平均:</span>
									<span className="font-medium">
										{formatNumber(rowData.average || 0)}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">回答数:</span>
									<span className="font-medium">
										{rowData.total_responses || 0}
									</span>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	return null;
}

export default StatsDisplay;

import React from "react";

const FreeResponseCard = ({
	response,
	categoryTitle,
	isExpanded,
	onToggle,
}) => {
	const shouldTruncate = response.answer.length > 200;
	const previewText = shouldTruncate
		? response.answer.substring(0, 200) + "..."
		: response.answer;

	return (
		<div className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
			<div className="p-4 cursor-pointer" onClick={onToggle}>
				<div className="flex items-start justify-between mb-2">
					<div className="flex-1">
						<span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mb-2">
							{categoryTitle}
						</span>

						<h4 className="font-semibold text-gray-800">
							Q: {response.question}
						</h4>
					</div>

					<button
						className="ml-4 text-gray-500 hover:text-gray-700 transition-colors"
						aria-label={isExpanded ? "折りたたむ" : "展開する"}
					>
						<svg
							className={`w-5 h-5 transform transition-transform ${isExpanded ? "rotate-180" : ""}`}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</button>
				</div>

				{isExpanded && (
					<div className="mt-3">
						<div className="text-gray-600">
							<span className="font-medium text-gray-700">A: </span>
							<span className="whitespace-pre-wrap">{response.answer}</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default FreeResponseCard;

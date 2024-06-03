import type { FC } from "react";
import StatusCard from "../StatusCard";
import { Button } from "../shadcn/ui/button";
import { TrashIcon } from "@heroicons/react/24/solid";

interface ReportOfOrisonProps {
	status: string;
	email: string;
	created_at: string;
	title: string;
	content: string;
}

const ReportOfOrison: FC<ReportOfOrisonProps> = ({
	status,
	email,
	created_at,
	title,
	content,
}) => {
	const fomartDate = (date: string) => {
		const day = String(new Date(date).getDate()).padStart(2, "0");
		const month = String(new Date(date).getMonth() + 1).padStart(2, "0");
		const year = new Date(date).getFullYear();
		const hour = String(new Date(date).getHours()).padStart(2, "0");
		const minute = String(new Date(date).getMinutes()).padStart(2, "0");
		const second = String(new Date(date).getSeconds()).padStart(2, "0");
		return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
	};
	return (
		<div
			className={`cursor-pointer border rounded-lg p-5`}
		>
			<div
				className={`cursor-pointer w-[400px] border rounded-lg p-5 ${status === "Đã xử lý" ? "bg-green-100" : "bg-red-100"
					} h-[min-content]`}
			>
				<div className="flex justify-between gap-5">
					<div className="flex items-center gap-3">
						<img
							src="/ui/sunflower.png"
							className="bg-transparent w-10 h-10"
						/>
						<div className="flex flex-col">
							<h4>{email}</h4>
							<h5 className="text-xs">{fomartDate(created_at)}</h5>
						</div>
					</div>
					<StatusCard status={status} />
				</div>
				<h1 className="font-bold mt-5">{title}</h1>
				<p>{content}</p>
				<div className="flex justify-center mt-5">
					<button className="flex gap-3 text-orange-400">
						<TrashIcon className="w-6 h-6" />
						<p className="font-bold">Xóa khiếu nại</p>
					</button>
				</div>
			</div>
		</div>
	);
};

export default ReportOfOrison;

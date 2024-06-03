import { useMemo, type FC } from "react";
import { Button } from "../shadcn/ui/button";

interface StatusCardProps {
	status: string;
}

const StatusCard: FC<StatusCardProps> = ({ status }) => {
	return (
		<Button className={`rounded-lg bg-${status === 'Chưa xử lý' ? 'red' : 'green'}-50 ${status === 'Chưa xử lý' ? 'text-red-500' : 'text-green-500'} border-[1px] ${status === 'Chưa xử lý' ? 'border-red-300' : 'border-green-300'} hover:bg-${status === 'Chưa xử lý' ? 'red' : 'green'}-100`}>
			{status}
		</Button>

	);
}

export default StatusCard
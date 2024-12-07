import { convertParams } from 'chanfana';
import { z } from 'zod';
import { R2Service } from './utils';

export const PREMIUM_SCALE = 8;
export const R2_PREFIX = 'uploads';

// FileBody
interface ParameterType {
	default?: string | number | boolean;
	description?: string;
	example?: string | number | boolean;
	required?: boolean;
	deprecated?: boolean;
}
interface StringParameterType extends ParameterType {
	format?: string;
}
export function FileBody(params?: StringParameterType): z.ZodString {
	return convertParams<z.ZodString>(z.string(), params);
}

type NewEnv = Omit<Env, 'TASK_STATUS_DURABLE_OBJECT'> & {
	R2_SERVICE: Service<R2Service>;
};
export type Bindings = Pick<NewEnv, keyof NewEnv>;

// Task
export enum TaskStatus {
	FAILED = 'FAILED',
	WAITING = 'WAITING',
	PROCESSING = 'PROCESSING',
	FINISHED = 'FINISHED',
	UNKNOWN = 'UNKNOWN',
}

export type TaskMessage = {
	task_id: string;
	raster_url: string;
	timestamp: number;
};

export type TaskStatusResult = {
	id: string;
	status: TaskStatus;
	image_url?: string | null;
	thumb_url?: string | null;
	progress?: number | null;
	timestamp: number;
};

// Cache
export type CacheHandler = {
	get: (key: string) => Promise<string | null>;
	set: (key: string, value: string, ttl?: number) => Promise<void>;
	del: (key: string) => Promise<void>;
};

export type TaskResult = {
	TaskId: string;
	ServerId: string;
	ServerEndpoint: string;
	UserId: string;
	Scale: number;
	OriginUrl: string;
	Status: TaskStatus;
	WaitDuration: number;
	ModelDuration: number;
	ProcessDuration: number;
	Duration: number;
	Result: string;
	Extra: Record<string, any>;
	ErrorMsg: string;
	CreatedAt: number;
	SendAt: number;
	FinishAt: number;
	UpdatedAt: number;
};

export type ServerResult = {
	ServerId: string;
	ServerType: string;
	ServerEndpoint: string;
	Status: ServerStatus;
	QueueSize: number;
	JobCount: number;
	FailedCount: number;
	SuccessCount: number;
	CPUCount: number;
	CPULoad: number;
	MemoryLoad: number;
	GPULoad: number;
	GPUMemoryLoad: number;
	DiskLoad: number;
	UpdatedAt: string;
	CreatedAt: string;
};

export enum ServerStatus {
	NotReady = 'not_ready', // NotReady 意味着服务器未准备好接受新的任务
	Running = 'running', // Running 意味着服务器正在运行，接受新的任务
	// ToBeStopped = 'to_be_stopped', // ToBeStopped 意味着服务器将在下个周期被停止
	Stopped = 'stopped', // Stopped 意味着服务器已停止，不接受新的任务，可以被重启
	// Maintenance = 'maintenance', // Maintenance 意味着服务器正在维护中，不接受新的任务，不被客户端上报的状态覆盖，并在下个周期标记为 ToBeRemoved
	ToBeRemoved = 'to_be_removed', // ToBeRemoved 意味着服务器将在下个周期被移除
	Removed = 'removed', // Removed 意味着服务器已经被移除
}

export interface Instance {
	is_bid: boolean;
	inet_up_billed: number;
	inet_down_billed: number;
	external: boolean;
	webpage: string | null;
	logo: string;
	rentable: boolean;
	compute_cap: number;
	credit_balance: number | null;
	credit_discount: number | null;
	credit_discount_max: number;
	driver_version: string;
	cuda_max_good: number;
	machine_id: number;
	hosting_type: string | null;
	public_ipaddr: string;
	geolocation: string;
	flops_per_dphtotal: number;
	dlperf_per_dphtotal: number;
	reliability2: number;
	host_run_time: number;
	client_run_time: number;
	host_id: number;
	id: number;
	bundle_id: number;
	num_gpus: number;
	total_flops: number;
	min_bid: number;
	dph_base: number;
	dph_total: number;
	gpu_name: string;
	gpu_ram: number;
	gpu_totalram: number;
	vram_costperhour: number;
	gpu_display_active: boolean;
	gpu_mem_bw: number;
	bw_nvlink: number;
	direct_port_count: number;
	gpu_lanes: number;
	pcie_bw: number;
	pci_gen: number;
	dlperf: number;
	cpu_name: string;
	mobo_name: string;
	cpu_ram: number;
	cpu_cores: number;
	cpu_cores_effective: number;
	gpu_frac: number;
	has_avx: number;
	disk_space: number;
	disk_name: string;
	disk_bw: number;
	inet_up: number;
	inet_down: number;
	start_date: number;
	end_date: number;
	duration: number;
	storage_cost: number;
	inet_up_cost: number;
	inet_down_cost: number;
	storage_total_cost: number;
	os_version: string;
	verification: string;
	static_ip: boolean;
	score: number;
	cpu_arch: string;
	ssh_idx: number | null;
	ssh_host: string | null;
	ssh_port: number | null;
	actual_status: string;
	intended_status: string;
	cur_state: string;
	next_state: string;
	template_hash_id: string;
	image_uuid: string;
	image_args: any[];
	image_runtype: string;
	extra_env: [string, string][];
	onstart: any | null;
	label: string | null;
	jupyter_token: string;
	status_msg: string;
	gpu_util: number;
	disk_util: number;
	disk_usage: number;
	gpu_temp: number;
	local_ipaddrs: string;
	direct_port_end: number;
	direct_port_start: number;
	cpu_util: number;
	mem_usage: number;
	mem_limit: number;
	vmem_usage: number;
	machine_dir_ssh_port: number;
	search: {
		gpuCostPerHour: number;
		diskHour: number;
		totalHour: number;
		discountTotalHour: number;
		discountedTotalPerHour: number;
	};
	instance: {
		gpuCostPerHour: number;
		diskHour: number;
		totalHour: number;
		discountTotalHour: number;
		discountedTotalPerHour: number;
	};
	time_remaining: string;
	time_remaining_isbid: string;
	internet_up_cost_per_tb: number;
	internet_down_cost_per_tb: number;
	ports: {
		[key: string]: { HostIp: string; HostPort: string }[];
	};
}

export type InstanceResult = {
	Id: number;
	Verification: string;
	Label: string;
	CpuName: string;
	GpuName: string;
	CurState: string;
	NextState: string;
	IsBid: boolean;
	InetUpBilled: number;
	InetDownBilled: number;
	MachineId: number;
	Blacklisted: number;
	PublicIpaddr: string;
	Geolocation: string;
	HostRunTime: number;
	ClientRunTime: number;
	MinBid: number;
	GpuRam: number;
	DiskSpace: number;
	TemplateHashId: string;
	ImageUuid: string;
	StatusMsg: string;
	GpuUtil: number;
	DiskUtil: number;
	CpuUtil: number;
	MemUsage: number;
	MemLimit: number;
	TotalHour: number;
	TimeRemaining: string;
	TimeRemainingIsbid: string;
	StartDate: number;
	CreatedAt: string;
	UpdatedAt: string;
};

export type getInstanceOffersArgs = {
	verified?: {
		eq: boolean;
	};
	rentable: {
		eq: true;
	};
	reliability2: {
		gte: number;
	};
	duration: {
		gte: number;
	};
	dph_total: {
		lte: number;
	};
	num_gpus: {
		gte: number;
		lte: number;
	};
	cpu_cores_effective: {
		gte: number;
	};
	cpu_ghz: {
		gte: number;
	};
	sort_option: {
		[key: string]: [string, 'desc' | 'asc'];
	};
	cuda_max_good: {
		gte: string;
	};
	allocated_storage: number;
	compute_cap?: { gt: string } | undefined;
	disk_space: {
		gt: number;
	};
	inet_down:
		| {
				gt: number;
		  }
		| undefined;
	inet_up:
		| {
				gt: number;
		  }
		| undefined;
	inet_down_cost:
		| {
				lt: number;
		  }
		| undefined;
	inet_up_cost:
		| {
				lt: number;
		  }
		| undefined;
	order: [string, 'desc' | 'asc'][];
	limit: number;
	type: 'ask' | 'bid';
};

export type InstanceOffer = {
	is_bid: boolean;
	inet_up_billed: null | number;
	inet_down_billed: null | number;
	external: boolean;
	webpage: null | string;
	logo: string;
	rentable: boolean;
	compute_cap: number;
	driver_version: string;
	cuda_max_good: number;
	machine_id: number;
	hosting_type: null | string;
	public_ipaddr: string;
	geolocation: string;
	flops_per_dphtotal: number;
	dlperf_per_dphtotal: number;
	reliability2: number;
	host_run_time: number;
	host_id: number;
	id: number;
	bundle_id: number;
	num_gpus: number;
	total_flops: number;
	min_bid: number;
	dph_base: number;
	dph_total: number;
	gpu_name: string;
	gpu_ram: number;
	gpu_display_active: boolean;
	gpu_mem_bw: number;
	bw_nvlink: number;
	direct_port_count: number;
	gpu_lanes: number;
	pcie_bw: number;
	pci_gen: number;
	dlperf: number;
	cpu_name: string;
	mobo_name: string;
	cpu_ram: number;
	cpu_cores: number;
	cpu_cores_effective: number;
	gpu_frac: number;
	has_avx: number;
	disk_space: number;
	disk_name: string;
	disk_bw: number;
	inet_up: number;
	inet_down: number;
	start_date: number;
	end_date: null | number;
	duration: null | number;
	storage_cost: number;
	inet_up_cost: number;
	inet_down_cost: number;
	storage_total_cost: number;
	verification: string;
	score: number;
	rented: boolean;
	bundled_results: number;
	pending_count: number;
};

export type ScaleUpParams = {
	template_id: number;
	template_hash_id: string;
	image_login: string;
	label: string;
	image: string;
	worker_url: string;
	admin_token: string;
	s3_bucket: string;
	s3_endpoint: string;
	s3_access_key_id: string;
	s3_secret_access_key: string;
	baseScale: number;
};
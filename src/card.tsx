interface Opts {
	// biome-ignore lint/suspicious/noExplicitAny: I don't know how to exactly type this but hey, it works.
	bg: any;
	avatar: string;
	username: string;
	currentXp: number;
	maxXp: number;
	progressWidth: string;
	level: number;
	rank: number;
}

export default (data: Opts) => (
	<div
		style={{
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			position: "relative",
			height: "100%",
			width: "100%",
		}}
	>
		<img
			src={data.bg}
			alt="Background"
			style={{
				position: "absolute",
				opacity: 0.5,
			}}
		/>
		<div
			style={{
				position: "absolute",
				top: "30px",
				right: "50px",
				display: "flex",
				fontSize: "32px",
				fontWeight: 800,
				flexDirection: "row",
				gap: "30px",
				alignItems: "center",
			}}
		>
			<span style={{ color: "#fff" }}>LEVEL {data.level}</span>
			<span style={{ fontSize: "24px", color: "#aaa" }}>#{data.rank}</span>
		</div>
		<div
			style={{
				display: "flex",
				flexDirection: "row",
				gap: "24px",
			}}
		>
			<img
				src={data.avatar}
				style={{
					width: "200px",
					height: "200px",
					borderRadius: "100%",
					border: "4px",
					borderColor: "#4A6482",
				}}
				alt="Avatar"
			/>

			<div
				style={{
					width: "70%",
					justifyContent: "flex-end",
					height: "160px",
					display: "flex",
					flexDirection: "column",
					gap: "5px",
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
					}}
				>
					<div
						style={{
							flexGrow: 1,
							color: "#fff",
							fontSize: "38px",
							fontWeight: 800,
						}}
					>
						{data.username}
					</div>
					<div
						style={{
							display: "flex",
							gap: "3px",
							flexDirection: "row",
							fontWeight: 800,
							fontSize: "32px",
						}}
					>
						<span style={{ color: "#fff" }}>
							{new Intl.NumberFormat().format(data.currentXp)}
						</span>
						<span style={{ color: "#aaa" }}>/</span>
						<span style={{ color: "#aaa" }}>
							{new Intl.NumberFormat().format(data.maxXp)}
						</span>
					</div>
				</div>

				<div
					style={{
						width: "100%",
						position: "relative",
						background: "#484B4E",
						height: "36px",
						borderRadius: "20px",
						display: "flex",
					}}
				>
					<div
						style={{
							width: `${Math.round((data.currentXp / data.maxXp) * 100)}%`,
							position: "absolute",
							background: "#fd9ff5",
							height: "36px",
							borderRadius: "20px",
							display: "block",
						}}
					>
						{" "}
					</div>
				</div>
			</div>
		</div>
	</div>
);

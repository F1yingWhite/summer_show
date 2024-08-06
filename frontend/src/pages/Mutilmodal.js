import OpenSeadragonViewer from "../components/OpenSeaDragonViewer"
import axios from 'axios';
import { useEffect, useState } from "react";

export function Mutilmodal() {

	const [tileSource, setTileSource] = useState(null);

	useEffect(() => {
		axios.get('http://localhost:9002/api/multimodal/wsi_lists')
			.then(res => {
				setTileSource(res.data);
			})
			.catch(err => {
				console.log(err);
			})
	}, []);

	return <>
		<div>
			多模态
		</div>
	</>
}
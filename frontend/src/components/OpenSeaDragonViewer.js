import React, { useEffect, useRef } from 'react';
import OpenSeadragon from 'openseadragon';

const OpenSeadragonViewer = ({ tileSource }) => {
	const viewerRef = useRef(null);
	useEffect(() => {
		const viewer = OpenSeadragon({
			id: 'viewer',
			prefixUrl: 'https://cdnjs.cloudflare.com/ajax/libs/openseadragon/2.4.2/images/',
			tileSources: `http://10.130.128.52:10023/static/dzi/${tileSource}/image.dzi`,
		});
		viewerRef.current = viewer;
		return () => {
			viewerRef.current.destroy();
		};
	}, [tileSource]);
	return <div id="viewer" style={{ width: '100%', height: '100vh' }} />;
};
export default OpenSeadragonViewer;
import { Button, message as messageApi, Upload, Spin, Progress } from "antd";
import NiiImageViewer from "../components/NiiImageViewer";
import axios from "axios";
import { useEffect, useState } from "react";
import { UploadOutlined } from '@ant-design/icons';

export function DicomPrediction() {
	const [niiname, setNiiname] = useState(null);
	const [niis, setNiis] = useState([]);
	const [fileList, setFileList] = useState([]);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [predictState, setPredictState] = useState(false);

	const fetchNiiList = async () => {
		axios.get('http://10.130.128.52:10023/api/multimodal/nii_lists')
			.then(res => {
				console.log(res.data);
				setNiis(res.data);
			})
			.catch(err => {
				console.log(err);
			});
	};

	useEffect(() => {
		fetchNiiList();
	}, []);

	const handleSelectChange = (event) => {
		const selectedNii = event.target.value;
		setNiiname(selectedNii);
	};

	const handlePrediction = () => {
		if (!niiname) {
			messageApi.error('Please select a NII file first.');
			return;
		}
		setPredictState(true);
		axios.post('http://10.130.128.52:10023/api/multimodal/predict_nii', {
			nii_name: niiname,
		})
			.then(res => {
				setPredictState(false);
				console.log(res.data);
				messageApi.success(`Prediction successful, result: ${res.data}`);
			})
			.catch(err => {
				setPredictState(false);
				console.log(err);
				messageApi.error('Prediction failed. Please try again.');
			});
	};

	const handleUploadChange = ({ file, fileList }) => {
		if (file.status === 'done') {
			messageApi.success(`Upload successful: ${file.name}`);
		} else if (file.status === 'error') {
			messageApi.error(`Upload failed: ${file.name}`);
		}
		setFileList(fileList);
	};

	const handleUploadProgress = (event) => {
		const percent = Math.round((event.loaded / event.total) * 100);
		setUploadProgress(percent);
	};

	const beforeUpload = (file) => {
		const isValidType = ['nii', 'gz'].includes(file.name.split('.').pop().toLowerCase());
		if (!isValidType) {
			messageApi.error('You can only upload NII or NII.GZ files!');
		}
		return isValidType;
	};

	const uploadProps = {
		name: 'file',
		action: 'http://10.130.128.52:10023/api/nii/upload',
		headers: {
			'Content-Type': 'multipart/form-data',
		},
		beforeUpload,
		onChange: handleUploadChange,
		customRequest: async ({ file, onSuccess, onError, onProgress }) => {
			const formData = new FormData();
			formData.append('file', file);
			try {
				await axios.post('http://10.130.128.52:10023/api/nii/upload', formData, {
					headers: { 'Content-Type': 'multipart/form-data' },
					onUploadProgress: handleUploadProgress
				});
				onSuccess?.(file);
				await fetchNiiList();
			} catch (err) {
				onError?.(err);
			}
		},
		showUploadList: false, // Hide upload list
		fileList: fileList,
	};

	return (
		<div style={styles.container}>
			<Spin spinning={predictState} fullscreen />
			<label htmlFor="nii-select" style={styles.label}>Select NII file:</label>
			<select id="nii-select" onChange={handleSelectChange} style={styles.select}>
				<option value="">Please select a NII file</option>
				{niis.map((nii, index) => (
					<option key={index} value={nii}>
						{nii}
					</option>
				))}
			</select>
			{niiname && <NiiImageViewer niiname={niiname} />}
			<Upload {...uploadProps}>
				<Button icon={<UploadOutlined />} style={styles.button}>Upload File</Button>
			</Upload>
			{uploadProgress > 0 && uploadProgress < 100 && (
				<Progress percent={uploadProgress} style={styles.progress} />
			)}
			<Button type="primary" style={styles.button} onClick={handlePrediction}>Predict</Button>
		</div>
	);
}

const styles = {
	container: {
		padding: '20px',
		fontFamily: 'Arial, sans-serif',
	},
	label: {
		display: 'block',
		marginBottom: '10px',
		fontSize: '18px',
		fontWeight: 'bold',
	},
	select: {
		width: '100%',
		padding: '10px',
		fontSize: '16px',
		marginBottom: '20px',
	},
	button: {
		marginLeft: '8px',
	},
	progress: {
		marginTop: '10px',
	},
};

export default DicomPrediction;
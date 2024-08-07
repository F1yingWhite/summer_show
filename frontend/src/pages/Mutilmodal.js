import { Button, message as messageApi, Upload, Spin, Table, Progress, Modal } from "antd";
import axios from 'axios';
import { useEffect, useState } from "react";
import { UploadOutlined } from '@ant-design/icons';
import NiiImageViewer from "../components/NiiImageViewer";
import OpenSeadragonViewer from "../components/OpenSeaDragonViewer";

export function MultimodalData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    axios.get('http://10.130.128.52:10023/api/multimodal/multilmodel_lists')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUploadChange = ({ file, fileList }) => {
    if (file.status === 'done') {
      messageApi.success(`Upload successful: ${file.name}`);
      fetchData();  // Refresh data after upload
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
    const isValidType = ['nii', 'svs', 'ndpi'].includes(file.name.split('.').pop().toLowerCase());
    if (!isValidType) {
      messageApi.error('You can only upload NII, SVS, or NDPI files!');
    }
    return isValidType;
  };

  const getUploadUrl = (file) => {
    const fileType = file.name.split('.').pop().toLowerCase();
    if (fileType === 'nii') {
      return 'http://10.130.128.52:10023/api/nii/upload';
    } else {
      return 'http://10.130.128.52:10023/api/wsi/upload';
    }
  };

  const uploadProps = {
    name: 'file',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    beforeUpload,
    onChange: handleUploadChange,
    customRequest: async ({ file, onSuccess, onError, onProgress }) => {
      const formData = new FormData();
      formData.append('file', file);
      const uploadUrl = getUploadUrl(file);
      try {
        await axios.post(uploadUrl, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: handleUploadProgress
        });
        onSuccess?.(file);
        fetchData();  // Refresh data after upload
      } catch (err) {
        onError?.(err);
      }
    },
    showUploadList: false, // Hide upload list
    fileList: fileList,
  };

  const handleViewNii = (nii_name) => {
    setModalContent(<NiiImageViewer niiname={nii_name} />);
    setIsModalVisible(true);
  };

  const handleViewSvs = (wsi_name) => {
    setModalContent(<OpenSeadragonViewer tileSource={wsi_name} />);
    setIsModalVisible(true);
  };

  const handlePredict = (nii_name, wsi_name) => {
    setLoading(true);
    axios.post('http://10.130.128.52:10023/api/multimodal/predict_mutil', { nii_name, wsi_name })
      .then(res => {
        messageApi.success('Prediction successful, result: ' + res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        messageApi.error('Prediction failed');
        setLoading(false);
      });
  };

  const renderUploadButton = (record, type) => {
    const uploadPropsForCell = {
      ...uploadProps,
      customRequest: async ({ file, onSuccess, onError }) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('pair_name', type === 'nii' ? record.wsi_name : record.nii_name);
        const uploadUrl = 'http://10.130.128.52:10023/api/multimodal/upload_pair';
        try {
          await axios.post(uploadUrl, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: handleUploadProgress
          });
          onSuccess?.(file);
          fetchData();  // Refresh data after upload
        } catch (err) {
          onError?.(err);
        }
      },
    };

    return (
      <Upload {...uploadPropsForCell}>
        <Button icon={<UploadOutlined />}>Upload {type.toUpperCase()}</Button>
      </Upload>
    );
  };

  const columns = [
    {
      title: 'NII Name',
      dataIndex: 'nii_name',
      key: 'nii_name',
      render: (text, record) => (
        text === '-' ? renderUploadButton(record, 'nii') : text
      ),
    },
    {
      title: 'WSI Name',
      dataIndex: 'wsi_name',
      key: 'wsi_name',
      render: (text, record) => (
        text === '-' ? renderUploadButton(record, 'svs') : text
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <div>
          <Button onClick={() => handleViewNii(record.nii_name)} disabled={record.nii_name === '-'}>Browse NII</Button>
          <Button onClick={() => handleViewSvs(record.wsi_name)} disabled={record.wsi_name === '-'}>Browse SVS</Button>
          <Button onClick={() => handlePredict(record.nii_name, record.wsi_name)}>Predict</Button>
        </div>
      ),
    },
  ];

  return (
    <div style={styles.container}>
      <Spin spinning={loading} fullscreen />
      <Upload {...uploadProps}>
        <Button icon={<UploadOutlined />} style={styles.button}>Upload File</Button>
      </Upload>
      {uploadProgress > 0 && uploadProgress < 100 && (
        <Progress percent={uploadProgress} style={styles.progress} />
      )}
      <Table columns={columns} dataSource={data} rowKey={(record) => record.nii_name + record.wsi_name} style={styles.table} />
      <Modal
        title="Viewer"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width="40%"
        height="40%"
      >
        {modalContent}
      </Modal>
    </div>
  );
}

export default MultimodalData;

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  button: {
    marginBottom: '20px',
  },
  progress: {
    marginTop: '10px',
    marginBottom: '20px',
  },
  table: {
    marginTop: '20px',
  },
};

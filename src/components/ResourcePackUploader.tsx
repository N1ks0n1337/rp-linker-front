import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Button,
  Link,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
  uploadResourcePack as uploadAPI,
  UploadResponse,
} from '../api';

export const ResourcePackUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<UploadResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((accepted: File[]) => {
    setError(null);
    setResult(null);
    if (accepted.length) setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { 'application/zip': ['.zip'] },
    maxSize: 50 * 1024 * 1024, // 50 МБ
  });

  const handleUpload = async () => {
    if (!file) {
      setError('Выберите ZIP-файл.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const resp = await uploadAPI(file);
      setResult(resp.data);
    } catch (e: any) {
      setError(e.response?.data?.detail || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 6 }}>
      <Typography variant="h5" gutterBottom>
        Загрузка Resource Pack
      </Typography>

      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.400',
          borderRadius: 2,
          p: 4,
          textAlign: 'center',
          cursor: 'pointer',
        }}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon sx={{ fontSize: 48, color: 'grey.600' }} />
        <Typography mt={1}>
          {isDragActive
            ? 'Отпустите файл...'
            : 'Перетащите сюда ZIP-файл или кликните'}
        </Typography>
        {file && (
          <Typography variant="body2" mt={1}>
            Выбран: {file.name}
          </Typography>
        )}
      </Box>

      <Box mt={3}>
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={loading || !file}
          startIcon={loading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
        >
          {loading ? 'Загрузка...' : 'Загрузить'}
        </Button>
      </Box>

      {error && (
        <Typography color="error" mt={2}>
          Ошибка: {error}
        </Typography>
      )}

      {result && (
        <Box mt={3}>
          <Typography>Ссылка для скачивания:</Typography>
          <Link href={result.download_url} target="_blank" rel="noopener">
            {result.download_url}
          </Link>
          <Typography mt={1}>SHA-1: {result.sha1}</Typography>
          <Typography mt={1}>Delete key: {result.delete_key}</Typography>
        </Box>
      )}
    </Paper>
  );
};

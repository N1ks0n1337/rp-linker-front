import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box, Button, Paper, Typography, Link, TextField, CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { uploadResourcePack, UploadResponse } from '../api';

export const ResourcePackUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<UploadResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const onDrop = useCallback((files: File[]) => {
    setError('');
    setResult(null);
    if (files.length) setFile(files[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { 'application/zip': ['.zip'] },
    maxSize: 95 * 1024 * 1024,
  });

  const handleUpload = async () => {
    if (!file) {
      setError('Пожалуйста, выберите ZIP-файл.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const resp = await uploadResourcePack(file);
      setResult(resp.data);
    } catch (e: any) {
      setError(e.response?.data?.detail || e.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      style={{ width: '100%', maxWidth: 800 }}
    >
      <Paper elevation={6} sx={{ p: 4, width: '100%' }}>
        <Typography variant="h5" gutterBottom textAlign="center">
          Загрузка Minecraft Resource Pack
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
            mt: 2,
            alignItems: 'center'
          }}
        >
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box
              {...getRootProps()}
              sx={{
                width: '100%',
                maxWidth: 360,
                mx: 'auto',
                border: '2px dashed',
                borderColor: isDragActive ? 'primary.main' : 'grey.600',
                borderRadius: 2,
                p: 4,
                textAlign: 'center',
                cursor: 'pointer',
                mb: 2,
              }}
            >
              <input {...getInputProps()} />
              <CloudUploadIcon sx={{ fontSize: 48, color: 'grey.500' }} />
              <Typography mt={2}>
                {isDragActive
                  ? 'Отпустите файл здесь...'
                  : 'Перетащите ZIP-файл или кликните'}
              </Typography>
              {file && (
                <Typography variant="body2" mt={1} sx={{ wordBreak: 'break-all' }}>
                  {file.name}
                </Typography>
              )}
            </Box>

            <Box sx={{ width: '100%', maxWidth: 360, mx: 'auto', textAlign: 'center' }}>
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
              <Typography color="error" mt={2} textAlign="center">
                {error}
              </Typography>
            )}
          </Box>

          {result && (
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" gutterBottom>
                Результат
              </Typography>

              <Box display="flex" alignItems="center" gap={1} mb={1} sx={{ flexWrap: 'wrap' }}>
                <Link
                  href={result.download_url}
                  target="_blank"
                  underline="hover"
                  sx={{ wordBreak: 'break-all' }}
                >
                  Скачать ресурс-пак
                </Link>
                <Button
                  size="small"
                  onClick={() => copyToClipboard(result.download_url)}
                  startIcon={<FileCopyIcon />}
                >
                  Копировать
                </Button>
              </Box>

              <Box display="flex" alignItems="center" gap={1} mb={1} sx={{ flexWrap: 'wrap' }}>
                <Typography sx={{ wordBreak: 'break-all' }}>
                  SHA-1: {result.sha1}
                </Typography>
                <Button
                  size="small"
                  onClick={() => copyToClipboard(result.sha1)}
                  startIcon={<FileCopyIcon />}
                >
                  Копировать
                </Button>
              </Box>

              <Typography mb={1}>Для server.properties:</Typography>
              <TextField
                multiline
                fullWidth
                rows={4}
                value={`resource-pack=${result.download_url}\nresource-pack-sha1=${result.sha1}`}
                InputProps={{
                  readOnly: true,
                  sx: { fontFamily: 'monospace', wordBreak: 'break-all' },
                }}
                sx={{ mb: 1 }}
              />

              <Box textAlign="right">
                <Button
                  onClick={() =>
                    copyToClipboard(
                      `resource-pack=${result.download_url}\nresource-pack-sha1=${result.sha1}`
                    )
                  }
                  startIcon={<FileCopyIcon />}
                >
                  Копировать всё
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
    </motion.div>
  );
};

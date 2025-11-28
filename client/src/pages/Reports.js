import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Paper,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  PictureAsPdf as PdfIcon,
  GetApp as DownloadIcon,
} from '@mui/icons-material';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import Layout from '../components/Layout';

const COLORS = ['#0ea5e9', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [filters, setFilters] = useState({
    chantier_id: '',
    start_date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
  });

  const fetchReportData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/reports/dashboard', {
        params: filters,
      });
      setReportData(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des rapports');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleGenerateReport = () => {
    fetchReportData();
  };

  const handleExportPDF = () => {
    if (!reportData) {
      toast.error('Aucune donnée à exporter');
      return;
    }

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPosition = 20;

      // En-tête
      doc.setFontSize(20);
      doc.setTextColor(14, 165, 233); // #0ea5e9
      doc.text('Rapport QHSE - Jayana', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;

      // Période
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      const periodText = `Période: ${filters.start_date ? format(new Date(filters.start_date), 'dd/MM/yyyy') : 'N/A'} - ${filters.end_date ? format(new Date(filters.end_date), 'dd/MM/yyyy') : 'N/A'}`;
      doc.text(periodText, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;
      doc.text(`Généré le: ${format(new Date(), 'dd/MM/yyyy à HH:mm')}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      // Résumé des statistiques
      doc.setFontSize(16);
      doc.text('Résumé des Statistiques', 14, yPosition);
      yPosition += 10;

      const summaryData = [
        ['Indicateur', 'Total', 'Détails'],
        [
          'Incidents',
          reportData.summary?.incidents?.total || 0,
          `Légers: ${reportData.summary?.incidents?.leger || 0} | Moyens: ${reportData.summary?.incidents?.moyen || 0} | Graves: ${reportData.summary?.incidents?.grave || 0}`
        ],
        [
          'Inspections',
          reportData.summary?.inspections?.total || 0,
          `Planifiées: ${reportData.summary?.inspections?.planned || 0} | Complétées: ${reportData.summary?.inspections?.completed || 0}`
        ],
        [
          'Non-conformités',
          reportData.summary?.nonConformities?.total || 0,
          `Ouvertes: ${reportData.summary?.nonConformities?.open || 0} | Fermées: ${reportData.summary?.nonConformities?.closed || 0}`
        ],
        [
          'Formations',
          reportData.summary?.trainings?.total || 0,
          `Complétées: ${reportData.summary?.trainings?.completed || 0}`
        ]
      ];

      doc.autoTable({
        startY: yPosition,
        head: [summaryData[0]],
        body: summaryData.slice(1),
        theme: 'striped',
        headStyles: { fillColor: [14, 165, 233], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 10 },
        margin: { left: 14, right: 14 }
      });

      yPosition = doc.lastAutoTable.finalY + 15;

      // Détails par catégorie
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = 20;
      }

      // Incidents par gravité
      doc.setFontSize(14);
      doc.text('Répartition des Incidents par Gravité', 14, yPosition);
      yPosition += 8;

      const incidentsDetail = [
        ['Gravité', 'Nombre'],
        ['Légers', reportData.summary?.incidents?.leger || 0],
        ['Moyens', reportData.summary?.incidents?.moyen || 0],
        ['Graves', reportData.summary?.incidents?.grave || 0]
      ];

      doc.autoTable({
        startY: yPosition,
        head: [incidentsDetail[0]],
        body: incidentsDetail.slice(1),
        theme: 'striped',
        headStyles: { fillColor: [239, 68, 68], textColor: 255 },
        styles: { fontSize: 10 },
        margin: { left: 14, right: 14 }
      });

      yPosition = doc.lastAutoTable.finalY + 15;

      // Inspections
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.text('État des Inspections', 14, yPosition);
      yPosition += 8;

      const inspectionsDetail = [
        ['État', 'Nombre'],
        ['Planifiées', reportData.summary?.inspections?.planned || 0],
        ['Complétées', reportData.summary?.inspections?.completed || 0]
      ];

      doc.autoTable({
        startY: yPosition,
        head: [inspectionsDetail[0]],
        body: inspectionsDetail.slice(1),
        theme: 'striped',
        headStyles: { fillColor: [14, 165, 233], textColor: 255 },
        styles: { fontSize: 10 },
        margin: { left: 14, right: 14 }
      });

      // Nom du fichier
      const fileName = `rapport-qhse-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      doc.save(fileName);
      toast.success('Export PDF réussi');
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
      toast.error('Erreur lors de l\'export PDF');
    }
  };

  const handleExportExcel = async () => {
    if (!reportData) {
      toast.error('Aucune donnée à exporter');
      return;
    }

    try {
      // Créer un nouveau workbook
      const wb = XLSX.utils.book_new();

      // Feuille 1: Résumé
      const summaryData = [
        ['Rapport QHSE - Jayana'],
        [`Période: ${filters.start_date || 'N/A'} - ${filters.end_date || 'N/A'}`],
        [`Généré le: ${format(new Date(), 'dd/MM/yyyy à HH:mm')}`],
        [],
        ['Résumé des Statistiques'],
        ['Indicateur', 'Total', 'Détails'],
        [
          'Incidents',
          reportData.summary?.incidents?.total || 0,
          `Légers: ${reportData.summary?.incidents?.leger || 0} | Moyens: ${reportData.summary?.incidents?.moyen || 0} | Graves: ${reportData.summary?.incidents?.grave || 0}`
        ],
        [
          'Inspections',
          reportData.summary?.inspections?.total || 0,
          `Planifiées: ${reportData.summary?.inspections?.planned || 0} | Complétées: ${reportData.summary?.inspections?.completed || 0}`
        ],
        [
          'Non-conformités',
          reportData.summary?.nonConformities?.total || 0,
          `Ouvertes: ${reportData.summary?.nonConformities?.open || 0} | Fermées: ${reportData.summary?.nonConformities?.closed || 0}`
        ],
        [
          'Formations',
          reportData.summary?.trainings?.total || 0,
          `Complétées: ${reportData.summary?.trainings?.completed || 0}`
        ]
      ];

      const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, ws1, 'Résumé');

      // Feuille 2: Incidents par gravité
      const incidentsData = [
        ['Gravité', 'Nombre'],
        ['Légers', reportData.summary?.incidents?.leger || 0],
        ['Moyens', reportData.summary?.incidents?.moyen || 0],
        ['Graves', reportData.summary?.incidents?.grave || 0],
        ['Total', reportData.summary?.incidents?.total || 0]
      ];

      const ws2 = XLSX.utils.aoa_to_sheet(incidentsData);
      XLSX.utils.book_append_sheet(wb, ws2, 'Incidents');

      // Feuille 3: Inspections
      const inspectionsData = [
        ['État', 'Nombre'],
        ['Planifiées', reportData.summary?.inspections?.planned || 0],
        ['Complétées', reportData.summary?.inspections?.completed || 0],
        ['Total', reportData.summary?.inspections?.total || 0]
      ];

      const ws3 = XLSX.utils.aoa_to_sheet(inspectionsData);
      XLSX.utils.book_append_sheet(wb, ws3, 'Inspections');

      // Feuille 4: Non-conformités
      const nonConformitiesData = [
        ['État', 'Nombre'],
        ['Ouvertes', reportData.summary?.nonConformities?.open || 0],
        ['Fermées', reportData.summary?.nonConformities?.closed || 0],
        ['Total', reportData.summary?.nonConformities?.total || 0]
      ];

      const ws4 = XLSX.utils.aoa_to_sheet(nonConformitiesData);
      XLSX.utils.book_append_sheet(wb, ws4, 'Non-conformités');

      // Feuille 5: Formations
      const trainingsData = [
        ['État', 'Nombre'],
        ['Complétées', reportData.summary?.trainings?.completed || 0],
        ['Total', reportData.summary?.trainings?.total || 0]
      ];

      const ws5 = XLSX.utils.aoa_to_sheet(trainingsData);
      XLSX.utils.book_append_sheet(wb, ws5, 'Formations');

      // Télécharger le fichier
      const fileName = `rapport-qhse-${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
      XLSX.writeFile(wb, fileName);
      toast.success('Export Excel réussi');
    } catch (error) {
      console.error('Erreur lors de l\'export Excel:', error);
      toast.error('Erreur lors de l\'export Excel');
    }
  };

  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  const incidentsData = reportData?.summary?.incidents
    ? [
        { name: 'Légers', value: parseInt(reportData.summary.incidents.leger || 0) },
        { name: 'Moyens', value: parseInt(reportData.summary.incidents.moyen || 0) },
        { name: 'Graves', value: parseInt(reportData.summary.incidents.grave || 0) },
      ]
    : [];

  const inspectionsData = reportData?.summary?.inspections
    ? [
        { name: 'Planifiées', value: parseInt(reportData.summary.inspections.planned || 0) },
        { name: 'Complétées', value: parseInt(reportData.summary.inspections.completed || 0) },
      ]
    : [];

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Reporting et Statistiques
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<PdfIcon />}
              onClick={handleExportPDF}
              sx={{ textTransform: 'none' }}
            >
              Export PDF
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExportExcel}
              sx={{ textTransform: 'none' }}
            >
              Export Excel
            </Button>
          </Box>
        </Box>

        {/* Filters */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Filtres de période
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                label="Date de début"
                type="date"
                fullWidth
                value={filters.start_date}
                onChange={(e) => handleFilterChange('start_date', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Date de fin"
                type="date"
                fullWidth
                value={filters.end_date}
                onChange={(e) => handleFilterChange('end_date', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleGenerateReport}
                sx={{ py: 1.5, textTransform: 'none' }}
              >
                Générer le rapport
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Incidents
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.main' }}>
                  {reportData?.summary?.incidents?.total || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Inspections
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                  {reportData?.summary?.inspections?.total || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Non-conformités
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                  {reportData?.summary?.nonConformities?.total || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Formations
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                  {reportData?.summary?.trainings?.total || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Répartition des Incidents par Gravité
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={incidentsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {incidentsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                État des Inspections
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={inspectionsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0ea5e9" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* Detailed Table */}
        {reportData && (
          <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Résumé Détaillé
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Indicateur</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="right">Total</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="right">Détails</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Incidents</TableCell>
                    <TableCell align="right">{reportData.summary?.incidents?.total || 0}</TableCell>
                    <TableCell align="right">
                      Légers: {reportData.summary?.incidents?.leger || 0} | Moyens:{' '}
                      {reportData.summary?.incidents?.moyen || 0} | Graves:{' '}
                      {reportData.summary?.incidents?.grave || 0}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Inspections</TableCell>
                    <TableCell align="right">{reportData.summary?.inspections?.total || 0}</TableCell>
                    <TableCell align="right">
                      Planifiées: {reportData.summary?.inspections?.planned || 0} | Complétées:{' '}
                      {reportData.summary?.inspections?.completed || 0}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Non-conformités</TableCell>
                    <TableCell align="right">{reportData.summary?.nonConformities?.total || 0}</TableCell>
                    <TableCell align="right">
                      Ouvertes: {reportData.summary?.nonConformities?.open || 0} | Fermées:{' '}
                      {reportData.summary?.nonConformities?.closed || 0}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Formations</TableCell>
                    <TableCell align="right">{reportData.summary?.trainings?.total || 0}</TableCell>
                    <TableCell align="right">
                      Complétées: {reportData.summary?.trainings?.completed || 0}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Box>
    </Layout>
  );
}


import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Select,
  InputLabel,
  OutlinedInput,
  Paper,
  Stack,
  CircularProgress,
} from "@mui/material";


function loadScript(url, callback) {
  const existingScript = document.getElementById("googleMaps");
  if (!existingScript) {
    const script = document.createElement("script");
    script.src = url;
    script.id = "googleMaps";
    script.async = true;
    script.defer = true;
    script.onload = callback;
    document.body.appendChild(script);
  } else {
    callback();
  }
}

export default function RequestBloodForm({ initialData = {}, onSubmit, title, buttonLabel }) {
  const [form, setForm] = useState({
    ...initialData,
    donation_point_lat: null,
    donation_point_lng: null,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const donationPointRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=AIzaSyAxjQtpZsmQISacL74_I90QUGElgEre69M&libraries=places`,
      () => {
        if (window.google && window.google.maps) {
          autocompleteRef.current = new window.google.maps.places.Autocomplete(
            donationPointRef.current,
            {
              types: ["establishment", "geocode"],
              componentRestrictions: { country: "lb" },
              fields: ["name", "formatted_address", "geometry"],
            }
          );

          autocompleteRef.current.addListener("place_changed", () => {
            const place = autocompleteRef.current.getPlace();
            if (place && (place.name || place.formatted_address)) {
              const locationName = `${place.name || ""} - ${place.formatted_address || ""}`.trim();
              const lat = place.geometry?.location.lat();
              const lng = place.geometry?.location.lng();

              setForm((prev) => ({
                ...prev,
                donation_point: locationName,
                donation_point_lat: lat,
                donation_point_lng: lng,
              }));
              setError(null);
            }
          });
        }
      }
    );
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);
    try {
      await onSubmit(form);
      setSuccess(true);
    } catch (error) {
      setError(error.response?.data?.error || "Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      component={Paper}
      elevation={3}
      sx={{
        maxWidth: 600,
        mx: "auto",
        my: 4,
        p: { xs: 2, sm: 4 },
        borderRadius: 3,
        background: "#fff",
      }}
    >
      <form onSubmit={handleSubmit} autoComplete="off">
        <Typography variant="h4" color="error" fontWeight="bold" mb={3} align="center">
          {title}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>Success! Your blood request was submitted.</Alert>}
        {loading && (
          <Stack alignItems="center" mb={2}>
            <CircularProgress color="error" />
          </Stack>
        )}

        {/* Urgency */}
        <FormControl component="fieldset" sx={{ mb: 2 }} required>
          <FormLabel component="legend" sx={{ fontWeight: "bold" }}>Urgency</FormLabel>
          <RadioGroup
            row
            name="urgency"
            value={form.urgency || ""}
            onChange={handleChange}
          >
            <FormControlLabel value="Regular" control={<Radio color="error" />} label="Regular" />
            <FormControlLabel value="Urgent" control={<Radio color="error" />} label="Urgent" />
          </RadioGroup>
        </FormControl>

        {/* Blood Type */}
        <FormControl fullWidth sx={{ mb: 2 }} required>
          <InputLabel>Blood Type</InputLabel>
          <Select
            name="blood_type"
            value={form.blood_type || ""}
            onChange={handleChange}
            input={<OutlinedInput label="Blood Type" />}
          >
            <MenuItem value="">Select Blood Type</MenuItem>
            <MenuItem value="A+">A+</MenuItem>
            <MenuItem value="A-">A-</MenuItem>
            <MenuItem value="B+">B+</MenuItem>
            <MenuItem value="B-">B-</MenuItem>
            <MenuItem value="AB+">AB+</MenuItem>
            <MenuItem value="AB-">AB-</MenuItem>
            <MenuItem value="O+">O+</MenuItem>
            <MenuItem value="O-">O-</MenuItem>
          </Select>
        </FormControl>

        {/* Quantity */}
        <FormControl fullWidth sx={{ mb: 2 }} required>
          <InputLabel>Unit</InputLabel>
          <Select
            name="quantity"
            value={form.quantity || ""}
            onChange={handleChange}
            input={<OutlinedInput label="Unit" />}
          >
            <MenuItem value="">Select Unit</MenuItem>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((unit) => (
              <MenuItem key={unit} value={unit}>{unit}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Date & Time */}
        <TextField
          label="Donation Date and Time"
          type="datetime-local"
          name="request_date"
          value={form.request_date || ""}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
        />


        {/* Donation Point with Google Autocomplete */}
        <TextField
          label="Donation Point"
          name="donation_point"
          placeholder="Start typing a location..."
          value={form.donation_point || ""}
          onChange={handleChange}
          inputRef={donationPointRef}
          fullWidth
          required
          sx={{ mb: 1 }}
          helperText="Choose a location from the suggestions."
        />

        {/* Map Preview */}
        {form.donation_point && (
          <Box mb={2}>
            <Typography fontWeight="bold" mb={1}>Map Preview</Typography>
            <Box sx={{ height: 300, width: "100%", borderRadius: 2, overflow: "hidden" }}>
              <iframe
                title="Google Maps Location"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={
                  form.donation_point_lat && form.donation_point_lng
                    ? `https://www.google.com/maps/embed/v1/view?key=AIzaSyAxjQtpZsmQISacL74_I90QUGElgEre69M&center=${form.donation_point_lat},${form.donation_point_lng}&zoom=16`
                    : `https://www.google.com/maps/embed/v1/place?key=AIzaSyAxjQtpZsmQISacL74_I90QUGElgEre69M&q=${encodeURIComponent(form.donation_point)}`
                }
              />
            </Box>
          </Box>
        )}

        {/* Contact Number */}
        <TextField
          label="Contact Number"
          name="contact_number"
          type="tel"
          value={form.contact_number || ""}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: <span style={{ marginRight: 8 }}>🇱🇧 +961</span>,
          }}
        />

        {/* Patient Name */}
        <TextField
          label="Name of the Patient"
          name="patient_name"
          value={form.patient_name || ""}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />

        {/* Description */}
        <TextField
          label="Short Description of the Problem"
          name="description"
          value={form.description || ""}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />

        {/* Transportation */}
        <FormControl fullWidth sx={{ mb: 3 }} required>
          <InputLabel>Transportation</InputLabel>
          <Select
            name="transportation"
            value={form.transportation || ""}
            onChange={handleChange}
            input={<OutlinedInput label="Transportation" />}
          >
            <MenuItem value="">Select Transportation</MenuItem>
            <MenuItem value="provided">Provided</MenuItem>
            <MenuItem value="not provided">Not Provided</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="error"
          type="submit"
          fullWidth
          size="large"
          disabled={loading}
          sx={{ fontWeight: "bold", py: 1.5 }}
        >
          {buttonLabel}
        </Button>
      </form>
    </Box>
  );
}
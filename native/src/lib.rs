use napi_derive::napi;
#[napi(strict)]
pub async fn sum_numbers(values: Vec<f64>) -> napi::Result<u32> {
    if values.iter().any(|value| !value.is_finite() || value.fract() != 0.0 || *value < 0.0 || *value > u32::MAX as f64) {
        return Err(napi::Error::from_reason("Values must be unsigned 32-bit integers"));
    }
    let result = zap_native::compute(move |token| {
        let mut total = 0u32;
        for value in values {
            token.check()?;
            let Some(next) = total.checked_add(value as u32) else { return Ok(None); };
            total = next;
        }
        Ok(Some(total))
    }).await.map_err(|error| napi::Error::from_reason(error.to_string()))?;
    result.ok_or_else(|| napi::Error::from_reason("Sum exceeds unsigned 32-bit range"))
}

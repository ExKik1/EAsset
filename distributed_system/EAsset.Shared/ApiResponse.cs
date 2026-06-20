namespace EAsset.Shared;

/// <summary>
/// Generic wrapper untuk semua response API di seluruh microservices.
/// </summary>
public class ApiResponse<T>
{
    public string Status  { get; set; } = "success";
    public string Message { get; set; } = string.Empty;
    public T?     Data    { get; set; }

    public static ApiResponse<T> Ok(T data, string message = "OK") =>
        new() { Status = "success", Message = message, Data = data };

    public static ApiResponse<T> Fail(string message) =>
        new() { Status = "error", Message = message, Data = default };
}

/// <summary>
/// Informasi paginasi untuk daftar data.
/// </summary>
public class PagedResult<T>
{
    public IEnumerable<T> Items      { get; set; } = [];
    public int            TotalItems { get; set; }
    public int            Page       { get; set; }
    public int            PageSize   { get; set; }
    public int            TotalPages => (int)Math.Ceiling((double)TotalItems / PageSize);
}

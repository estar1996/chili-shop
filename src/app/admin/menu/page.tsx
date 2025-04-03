<div className="mb-4">
  <form className="flex items-center space-x-2">
    <Checkbox
      id="featured"
      label="인기상품"
      checked={isFeatured}
      onChange={(e) => setIsFeatured(e.target.checked)}
    />
  </form>
</div> 
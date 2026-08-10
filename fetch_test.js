async function fetchOrders() {
  try {
    const res = await fetch("http://localhost:5000/api/order?status=Pending");
    const json = await res.json();
    console.log(JSON.stringify(json.data[0].running_order, null, 2));
  } catch (e) {
    console.error(e);
  }
}
fetchOrders();

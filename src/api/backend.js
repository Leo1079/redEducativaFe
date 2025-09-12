useEffect(() => {
  fetch('http://localhost:3001/api/usuarios')
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));
}, []);
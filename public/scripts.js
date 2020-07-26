const username = prompt('Enter Username');
const socket = io('http://localhost:9000', {
  query: {
    username: username,
  },
});
let nsSocket = '';

socket.on('nsList', (nsData) => {
  // Adding All Namespaces to HTML
  const namespacesDiv = document.querySelector('.namespaces');
  namespacesDiv.innerHTML = '';
  nsData.forEach((ns) => {
    namespacesDiv.innerHTML += `<div class="namespace" ns="${ns.endpoint}">
    <img
      src="${ns.imageUrl}"
    />
  </div>`;
  });

  // Adding event Listener on Each namespace
  document.querySelectorAll('.namespace').forEach((ns) => {
    ns.addEventListener('click', (e) => {
      const nsEndpoint = ns.getAttribute('ns');
      joinNs(nsEndpoint);
    });
  });
  joinNs(nsData[0].endpoint);
});

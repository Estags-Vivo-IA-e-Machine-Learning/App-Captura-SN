import { Navbar, Container, Nav } from "react-bootstrap";

export default function Header() {
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">Leitor de Serial Number</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home">Enviar foto</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

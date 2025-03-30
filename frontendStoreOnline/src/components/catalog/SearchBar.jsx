import { useState } from "react";
import { searchProducts } from "../../api/productAPI.js";

const SearchBar = ({ setProducts }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = async () => {
        if (searchTerm.trim() !== '') {
            const results = await searchProducts(searchTerm);
            
            if(results.length === 0) {
                alert("Producto no encontrado");
            }
            setProducts(results);
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Buscar producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} 
            />
            <button onClick={handleSearch}>Buscar</button>
        </div>
    );
};

export default SearchBar;
-- Insert data into the 'locations' table
INSERT INTO locations (name, address) VALUES
('Biblioteka Główna AGH', 'Aleja Adama Mickiewicza 30, 30-059 Kraków'),
('Biblioteka Uniwersytecka w Warszawie', 'ul. Dobra 56/66, 00-312 Warszawa'),
('Wojewódzka Biblioteka Publiczna w Gdańsku', 'Targ Rakowy 5/6, 80-895 Gdańsk');

-- Insert data into the 'books' table
INSERT INTO books (title, author, isbn, published_date) VALUES
('The Witcher: The Last Wish', 'Andrzej Sapkowski', '978-0316497709', '1993-01-01 00:00:00'),
('Fahrenheit 451', 'Ray Bradbury', '978-1451673315', '1971-10-10 00:00:00'),
('1984', 'George Orwell', '978-0451524935', '1971-06-08 00:00:00'),
('Pride and Prejudice', 'Jane Austen', '978-0141439518', '1978-01-28 00:00:00'),
('To Kill a Mockingbird', 'Harper Lee', '978-0061120084', '1979-07-11 00:00:00');

-- Insert data into the 'inventory' table
INSERT INTO inventory (book_id, location_id, quantity) VALUES
(1, 1, 5), -- The Witcher at Biblioteka Główna AGH
(1, 2, 3), -- The Witcher at Biblioteka Uniwersytecka w Warszawie
(2, 1, 2), -- Fahrenheit 451 at Biblioteka Główna AGH
(3, 3, 7), -- 1984 at Wojewódzka Biblioteka Publiczna w Gdańsku
(4, 2, 4), -- Pride and Prejudice at Biblioteka Uniwersytecka w Warszawie
(5, 1, 6), -- To Kill a Mockingbird at Biblioteka Główna AGH
(2, 2, 5), -- Fahrenheit 451 at Biblioteka Uniwersytecka w Warszawie
(3, 1, 3), -- 1984 at Biblioteka Główna AGH
(4, 3, 8), -- Pride and Prejudice at Wojewódzka Biblioteka Publiczna w Gdańsku
(5, 2, 2), -- To Kill a Mockingbird at Biblioteka Uniwersytecka w Warszawie
(1, 3, 4), -- The Witcher at Wojewódzka Biblioteka Publiczna w Gdańsku
(5, 3, 1), -- To Kill a Mockingbird at Wojewódzka Biblioteka Publiczna w Gdańsku
(2, 3, 3), -- Fahrenheit 451 at Wojewódzka Biblioteka Publiczna w Gdańsku
(3, 2, 6); -- 1984 at Biblioteka Uniwersytecka w Warszawie
import os
from datetime import date
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from movies.models import Genre, Movie
from movies.utils import extract_youtube_video_id


class Command(BaseCommand):
    help = "Seed database with high quality sample movies, genres, and YouTube trailers"

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Seeding genres and movies..."))

        genres_data = [
            {"name": "Action", "description": "High-octane action movies packed with thrilling stunts, fights, and chases."},
            {"name": "Adventure", "description": "Epic journeys, quests, exploration, and thrilling discoveries across unknown worlds."},
            {"name": "Sci-Fi", "description": "Mind-bending futuristic concepts, space exploration, time travel, and advanced technology."},
            {"name": "Drama", "description": "Intense human emotions, powerful narratives, relationships, and life-changing conflicts."},
            {"name": "Comedy", "description": "Laugh-out-loud humor, hilarious misadventures, witty banter, and lighthearted fun."},
            {"name": "Thriller", "description": "Suspenseful psychological twists, crime investigations, high stakes, and nail-biting tension."},
            {"name": "Horror", "description": "Chilling supernatural encounters, psychological dread, dark mysteries, and terror."},
            {"name": "Animation", "description": "Visually stunning animated masterpieces, heartwarming tales, and family adventures."},
            {"name": "Romance", "description": "Passionate love stories, emotional bonds, heartbreak, and heartwarming connections."},
            {"name": "Fantasy", "description": "Mythical realms, magic spells, legendary creatures, and ancient heroic sagas."},
        ]

        genre_objs = {}
        for g in genres_data:
            obj, created = Genre.objects.get_or_create(
                name=g["name"],
                defaults={"description": g["description"]}
            )
            genre_objs[g["name"]] = obj
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created Genre: {obj.name}"))

        movies_data = [
            {
                "title": "Inception",
                "description": "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.",
                "youtube_url": "https://www.youtube.com/watch?v=YoHD9XEInc0",
                "genres": ["Action", "Sci-Fi", "Adventure"],
                "release_date": date(2010, 7, 16),
                "duration": "2h 28m",
                "director": "Christopher Nolan",
                "writers": "Christopher Nolan",
                "cast": "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page, Tom Hardy, Ken Watanabe, Cillian Murphy",
                "language": "English",
                "country": "United States",
                "rating": 8.8,
                "is_featured": True,
                "is_trending": True,
                "is_popular": True,
                "is_published": True,
            },
            {
                "title": "Interstellar",
                "description": "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans through a mysterious wormhole near Saturn.",
                "youtube_url": "https://www.youtube.com/watch?v=zSWdZVtXT7E",
                "genres": ["Sci-Fi", "Drama", "Adventure"],
                "release_date": date(2014, 11, 7),
                "duration": "2h 49m",
                "director": "Christopher Nolan",
                "writers": "Jonathan Nolan, Christopher Nolan",
                "cast": "Matthew McConaughey, Anne Hathaway, Jessica Chastain, Michael Caine, Matt Damon",
                "language": "English",
                "country": "United States",
                "rating": 8.7,
                "is_featured": True,
                "is_trending": True,
                "is_popular": True,
                "is_published": True,
            },
            {
                "title": "The Dark Knight",
                "description": "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
                "youtube_url": "https://www.youtube.com/watch?v=EXeTwQWrcwY",
                "genres": ["Action", "Thriller", "Drama"],
                "release_date": date(2008, 7, 18),
                "duration": "2h 32m",
                "director": "Christopher Nolan",
                "writers": "Jonathan Nolan, Christopher Nolan, David S. Goyer",
                "cast": "Christian Bale, Heath Ledger, Aaron Eckhart, Michael Caine, Gary Oldman, Morgan Freeman",
                "language": "English",
                "country": "United States",
                "rating": 9.0,
                "is_featured": True,
                "is_trending": True,
                "is_popular": True,
                "is_published": True,
            },
            {
                "title": "Dune: Part Two",
                "description": "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future.",
                "youtube_url": "https://www.youtube.com/watch?v=Way9Dexny3w",
                "genres": ["Sci-Fi", "Action", "Adventure"],
                "release_date": date(2024, 3, 1),
                "duration": "2h 46m",
                "director": "Denis Villeneuve",
                "writers": "Denis Villeneuve, Jon Spaihts, Frank Herbert",
                "cast": "Timothée Chalamet, Zendaya, Rebecca Ferguson, Javier Bardem, Austin Butler, Florence Pugh",
                "language": "English",
                "country": "United States",
                "rating": 8.6,
                "is_featured": True,
                "is_trending": True,
                "is_popular": True,
                "is_published": True,
            },
            {
                "title": "Spider-Man: Across the Spider-Verse",
                "description": "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.",
                "youtube_url": "https://www.youtube.com/watch?v=cqGjhVJWtEg",
                "genres": ["Animation", "Action", "Sci-Fi", "Adventure"],
                "release_date": date(2023, 6, 2),
                "duration": "2h 20m",
                "director": "Joaquim Dos Santos, Kemp Powers, Justin K. Thompson",
                "writers": "Phil Lord, Christopher Miller, Dave Callaham",
                "cast": "Shameik Moore, Hailee Steinfeld, Oscar Isaac, Daniel Kaluuya, Jake Johnson",
                "language": "English",
                "country": "United States",
                "rating": 8.7,
                "is_featured": False,
                "is_trending": True,
                "is_popular": True,
                "is_published": True,
            },
            {
                "title": "Oppenheimer",
                "description": "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, followed by political intrigue and hearings during the Red Scare.",
                "youtube_url": "https://www.youtube.com/watch?v=uYPbbksJxIg",
                "genres": ["Drama", "Thriller"],
                "release_date": date(2023, 7, 21),
                "duration": "3h 00m",
                "director": "Christopher Nolan",
                "writers": "Christopher Nolan, Kai Bird, Martin J. Sherwin",
                "cast": "Cillian Murphy, Emily Blunt, Matt Damon, Robert Downey Jr., Florence Pugh",
                "language": "English",
                "country": "United States",
                "rating": 8.9,
                "is_featured": False,
                "is_trending": True,
                "is_popular": True,
                "is_published": True,
            },
            {
                "title": "Avatar: The Way of Water",
                "description": "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.",
                "youtube_url": "https://www.youtube.com/watch?v=d9MyW72ELq0",
                "genres": ["Sci-Fi", "Action", "Adventure", "Fantasy"],
                "release_date": date(2022, 12, 16),
                "duration": "3h 12m",
                "director": "James Cameron",
                "writers": "James Cameron, Rick Jaffa, Amanda Silver",
                "cast": "Sam Worthington, Zoe Saldana, Sigourney Weaver, Stephen Lang, Kate Winslet",
                "language": "English",
                "country": "United States",
                "rating": 7.6,
                "is_featured": False,
                "is_trending": False,
                "is_popular": True,
                "is_published": True,
            },
            {
                "title": "Top Gun: Maverick",
                "description": "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN's elite graduates on an impossible mission that demands the ultimate sacrifice from those chosen to fly it.",
                "youtube_url": "https://www.youtube.com/watch?v=giXco2jaZ_4",
                "genres": ["Action", "Drama"],
                "release_date": date(2022, 5, 27),
                "duration": "2h 10m",
                "director": "Joseph Kosinski",
                "writers": "Jim Cash, Jack Epps Jr., Peter Craig, Justin Marks, Ehren Kruger",
                "cast": "Tom Cruise, Miles Teller, Jennifer Connelly, Jon Hamm, Glen Powell, Ed Harris",
                "language": "English",
                "country": "United States",
                "rating": 8.3,
                "is_featured": False,
                "is_trending": True,
                "is_popular": True,
                "is_published": True,
            },
            {
                "title": "Blade Runner 2049",
                "description": "Young Blade Runner K's discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who's been missing for thirty years, unraveling a mystery that could plunge what's left of society into chaos.",
                "youtube_url": "https://www.youtube.com/watch?v=gCcx85zbxz4",
                "genres": ["Sci-Fi", "Mystery", "Drama", "Thriller"],
                "release_date": date(2017, 10, 6),
                "duration": "2h 44m",
                "director": "Denis Villeneuve",
                "writers": "Hampton Fancher, Michael Green, Philip K. Dick",
                "cast": "Ryan Gosling, Harrison Ford, Ana de Armas, Sylvia Hoeks, Robin Wright",
                "language": "English",
                "country": "United States",
                "rating": 8.0,
                "is_featured": False,
                "is_trending": False,
                "is_popular": True,
                "is_published": True,
            },
            {
                "title": "Everything Everywhere All at Once",
                "description": "A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence by exploring other universes and connecting with the lives she could have led.",
                "youtube_url": "https://www.youtube.com/watch?v=wxN1T1uxQ2g",
                "genres": ["Comedy", "Action", "Sci-Fi", "Fantasy"],
                "release_date": date(2022, 4, 8),
                "duration": "2h 19m",
                "director": "Daniel Kwan, Daniel Scheinert",
                "writers": "Daniel Kwan, Daniel Scheinert",
                "cast": "Michelle Yeoh, Stephanie Hsu, Ke Huy Quan, James Hong, Jamie Lee Curtis",
                "language": "English",
                "country": "United States",
                "rating": 7.8,
                "is_featured": False,
                "is_trending": True,
                "is_popular": True,
                "is_published": True,
            },
            {
                "title": "Avengers: Endgame",
                "description": "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
                "youtube_url": "https://www.youtube.com/watch?v=TcMBFSGVi1c",
                "genres": ["Action", "Sci-Fi", "Adventure", "Fantasy"],
                "release_date": date(2019, 4, 26),
                "duration": "3h 01m",
                "director": "Anthony Russo, Joe Russo",
                "writers": "Christopher Markus, Stephen McFeely, Stan Lee",
                "cast": "Robert Downey Jr., Chris Evans, Mark Ruffalo, Chris Hemsworth, Scarlett Johansson, Jeremy Renner",
                "language": "English",
                "country": "United States",
                "rating": 8.4,
                "is_featured": False,
                "is_trending": True,
                "is_popular": True,
                "is_published": True,
            },
            {
                "title": "The Batman",
                "description": "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption and question his family's involvement.",
                "youtube_url": "https://www.youtube.com/watch?v=mqqft2x_Aa4",
                "genres": ["Action", "Crime", "Drama", "Thriller"],
                "release_date": date(2022, 3, 4),
                "duration": "2h 56m",
                "director": "Matt Reeves",
                "writers": "Matt Reeves, Peter Craig, Bob Kane",
                "cast": "Robert Pattinson, Zoë Kravitz, Jeffrey Wright, Colin Farrell, Paul Dano, Andy Serkis",
                "language": "English",
                "country": "United States",
                "rating": 7.8,
                "is_featured": False,
                "is_trending": True,
                "is_popular": True,
                "is_published": True,
            }
        ]

        for m in movies_data:
            genre_names = m.pop("genres")
            movie, created = Movie.objects.get_or_create(
                title=m["title"],
                defaults=m
            )
            for g_name in genre_names:
                if g_name in genre_objs:
                    movie.genres.add(genre_objs[g_name])

            if created:
                self.stdout.write(self.style.SUCCESS(f"Created Movie: {movie.title} (ID: {movie.youtube_video_id})"))
            else:
                self.stdout.write(self.style.WARNING(f"Movie already exists: {movie.title}"))

        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully!"))

// Elementos del catálogo y de la ficha
const movieGrid = document.getElementById("movieGrid");
const typeFilter = document.getElementById("typeFilter");
const audienceFilter = document.getElementById("audienceFilter");
const searchMessage = document.getElementById("searchMessage");
const searchInput = document.getElementById("searchInput");
const exploreButton = document.getElementById("exploreButton");

const movieDetails = document.getElementById("movieDetails");
const detailTitle = document.getElementById("detailTitle");
const detailMeta = document.getElementById("detailMeta");
const detailDescription = document.getElementById("detailDescription");

const watchButton = document.getElementById("watchButton");
const backButton = document.getElementById("backButton");

const seriesEpisodes =
    document.getElementById("seriesEpisodes");

const episodeList =
    document.getElementById("episodeList");

let selectedMovie = null;

// Crear un reemplazo visual cuando no hay póster
function createPosterFallback() {
  const fallback = document.createElement("div");
  fallback.className = "movie-poster poster-fallback";
  fallback.setAttribute("aria-label", "Sin póster disponible");

  const icon = document.createElement("span");
  icon.className = "material-symbols-rounded";
  icon.textContent = "image";
  icon.setAttribute("aria-hidden", "true");

  fallback.appendChild(icon);
  return fallback;
}

// Mostrar la ficha de una película
function showMovieDetails(content) {

    selectedMovie = content;

    detailTitle.textContent =
        content.title;

    detailDescription.textContent =
        content.description || "";

    detailMeta.replaceChildren();

    const metadata = [
        content.year,
        content.duration,
        content.rating || content.ageRating,
        content.genre,
        content.country
    ].filter(Boolean);

    metadata.forEach((value) => {

        const item =
            document.createElement("span");

        item.textContent = value;

        detailMeta.appendChild(item);
    });


    // =========================
    // FONDO
    // =========================

    movieDetails.style.backgroundImage =
        `url("${content.poster}")`;


    // =========================
    // ¿PELÍCULA O SERIE?
    // =========================

    if (content.type === "series") {

        // Ocultar botón de película
        watchButton.hidden = true;

        // Mostrar episodios
        seriesEpisodes.hidden = false;

        renderSeriesEpisodes(content);

    } else {

        // Película normal
        watchButton.hidden = false;

        seriesEpisodes.hidden = true;

        episodeList.replaceChildren();
    }


    movieDetails.hidden = false;

    movieDetails.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// INFO DE LAS SERIES
function renderSeriesEpisodes(seriesData) {

    episodeList.replaceChildren();

    if (
        !seriesData.seasons ||
        seriesData.seasons.length === 0
    ) {
        return;
    }

    seriesData.seasons.forEach((season) => {

        const seasonTitle =
            document.createElement("h3");

        seasonTitle.className =
            "episode-season-title";

        seasonTitle.textContent =
            `Temporada ${season.number}`;

        episodeList.appendChild(seasonTitle);


        season.episodes.forEach((episode) => {

            const episodeCard =
                document.createElement("article");

            episodeCard.className =
                "episode-card";


            const thumbnail =
                document.createElement("img");

            thumbnail.className =
                "episode-thumbnail";

            thumbnail.src =
                episode.thumbnail ||
                "assets/images/placeholder.jpg";

            thumbnail.alt =
                `Miniatura del episodio ${episode.number}`;


            const episodeInfo =
                document.createElement("div");

            episodeInfo.className =
                "episode-info";


            const episodeNumber =
                document.createElement("span");

            episodeNumber.className =
                "episode-number";

            episodeNumber.textContent =
                `Episodio ${episode.number}`;


            const episodeTitle =
                document.createElement("h4");

            episodeTitle.textContent =
                episode.title;


            const watchEpisode =
                document.createElement("button");

            watchEpisode.className =
                "episode-watch-button";

            watchEpisode.type =
                "button";

            watchEpisode.innerHTML = `
                <span
                    class="material-symbols-rounded"
                    aria-hidden="true"
                >play_arrow</span>

                <span>Ver capítulo</span>
            `;


            watchEpisode.addEventListener(
                "click",
                () => {

                    playMovie({
    title:
        `${seriesData.title} · ${episode.title}`,

    video:
        episode.video,

    ageRating:
        seriesData.ageRating,

    contentNotice:
        seriesData.contentNotice
});

                }
            );


            episodeInfo.append(
                episodeNumber,
                episodeTitle,
                watchEpisode
            );


            episodeCard.append(
                thumbnail,
                episodeInfo
            );


            episodeList.appendChild(
                episodeCard
            );

        });

    });
}


// Crear las tarjetas del catálogo
function renderMovies(movieList) {
  movieGrid.replaceChildren();

  movieList.forEach((movie) => {

    // =========================
    // TARJETA
    // =========================
    const card = document.createElement("article");

    card.className = "movie-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute(
      "aria-label",
      `Ver detalles de ${movie.title}`
    );


    // =========================
    // PORTADA
    // =========================
    const posterContainer = document.createElement("div");
    posterContainer.className = "movie-poster-container";


    let poster;

    if (movie.poster && movie.poster.trim() !== "") {

      poster = document.createElement("img");

      poster.className = "movie-poster";
      poster.src = movie.poster;
      poster.alt = `Portada de ${movie.title}`;
      poster.loading = "lazy";

      poster.addEventListener(
        "error",
        () => {
          poster.replaceWith(createPosterFallback());
        },
        { once: true }
      );

    } else {

      poster = createPosterFallback();

    }

    posterContainer.appendChild(poster);


    // =========================
    // ESTADO DE DISPONIBILIDAD
    // =========================
    if (movie.available) {

      const availableBadge = document.createElement("span");

      availableBadge.className = "movie-available";
      availableBadge.textContent = "Disponible";

      posterContainer.appendChild(availableBadge);

    } else {

      const unavailableBadge = document.createElement("span");

      unavailableBadge.className = "movie-unavailable";
      unavailableBadge.textContent = "Próximamente";

      posterContainer.appendChild(unavailableBadge);

    }


    // =========================
    // INFORMACIÓN
    // =========================
    const cardContent = document.createElement("div");
    cardContent.className = "movie-card-content";


    // Título
    const title = document.createElement("h3");

    title.textContent = movie.title;


    // Información principal
    const meta = document.createElement("div");
    meta.className = "movie-card-meta";


    const metaValues = [
      movie.year,
      movie.genre
    ].filter(Boolean);


    metaValues.forEach((value) => {

      const item = document.createElement("span");

      item.textContent = value;

      meta.appendChild(item);

    });


    // Información secundaria
    const details = document.createElement("div");
    details.className = "movie-card-details";


    const detailValues = [
      movie.country,
      movie.ageRating
    ].filter(Boolean);


    detailValues.forEach((value) => {

      const item = document.createElement("span");

      item.textContent = value;

      details.appendChild(item);

    });


    // Acción
    const action = document.createElement("span");

    action.className = "movie-card-action";

    action.textContent = movie.available
      ? "Ver detalles"
      : "Ver información";


    // =========================
    // ARMAR TARJETA
    // =========================
    cardContent.append(
      title,
      meta,
      details,
      action
    );

    card.append(
      posterContainer,
      cardContent
    );


    // =========================
    // INTERACCIÓN
    // =========================

    // Click
    card.addEventListener("click", () => {
      showMovieDetails(movie);
    });


    // Teclado
    card.addEventListener("keydown", (event) => {

      if (
        event.key === "Enter" ||
        event.key === " "
      ) {

        event.preventDefault();

        showMovieDetails(movie);

      }

    });


    movieGrid.appendChild(card);

  });
}


// Botón "Ver película"
watchButton.addEventListener("click", () => {
  if (selectedMovie) {
    playMovie(selectedMovie);
  }
});


// Botón "Volver al catálogo"
backButton.addEventListener("click", () => {
  movieDetails.hidden = true;

  document.getElementById("inicio").hidden = false;
  document.getElementById("catalogo").hidden = false;

  document.getElementById("catalogo").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});


// Botón "Explorar catálogo" de la portada
exploreButton.addEventListener("click", () => {
  document.getElementById("catalogo").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

// Búsqueda y filtros
// Búsqueda y filtros
function applyFilters() {

    const searchTerm =
        searchInput.value.trim().toLowerCase();

    const selectedType =
        typeFilter.value;

    const selectedAudience =
        audienceFilter.value;


    // =========================
    // TODO EL CONTENIDO
    // =========================

    const allContent = [
        ...movies,
        ...series
    ];


    // =========================
    // FILTRAR
    // =========================

    const filteredContent =
        allContent.filter((content) => {

            const matchesSearch =
                content.title
                    .toLowerCase()
                    .includes(searchTerm) ||

                (content.genre || "")
                    .toLowerCase()
                    .includes(searchTerm) ||

                (content.country || "")
                    .toLowerCase()
                    .includes(searchTerm);


            const matchesType =
                selectedType === "all" ||
                content.type === selectedType;


            const matchesAudience =
                selectedAudience === "all" ||
                content.audience === selectedAudience;


            return (
                matchesSearch &&
                matchesType &&
                matchesAudience
            );

        });


    // =========================
    // RESULTADOS
    // =========================

    if (filteredContent.length > 0) {

        searchMessage.hidden = true;
        searchMessage.textContent = "";

        renderMovies(filteredContent);

        return;
    }


    // =========================
    // RECOMENDACIONES
    // =========================

    const recommendations =
        allContent
            .filter(
                (content) =>
                    !filteredContent.includes(content)
            )
            .slice(0, 3);


    const searchedTitle =
        searchInput.value.trim();


    searchMessage.textContent =
        searchedTitle
            ? `No encontramos "${searchedTitle}", pero puedes mirar estas recomendaciones.`
            : "No encontramos contenido con esos filtros. Quizás te interesen estas recomendaciones.";


    searchMessage.hidden = false;

    renderMovies(recommendations);
}

searchInput.addEventListener("input", applyFilters);
typeFilter.addEventListener("change", applyFilters);
audienceFilter.addEventListener("change", applyFilters);


// Mostrar el catálogo al iniciar
applyFilters();
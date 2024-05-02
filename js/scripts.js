const containerCard = document.getElementById('container-card')
const prevPage = document.getElementById('prevPage')
const nextPage = document.getElementById('nextPage')
const filter = document.getElementById('filter')

let search = false
let nameSearch = ''
let currentPage = 1
let totalPages = 1
if (filter === null) {
    search = false
}

//get name of last episode
async function getLastEpisode(ep) {
    try {
        const response = await api.get(`/episode/${ep}`)
        const episodeName = response.data.name
        return episodeName
    } catch (e) {
        console.log('Error', e)
    }
}

//event keyup for search
filter.addEventListener('keyup', e => {
    const nameCharacter = e.target.value
    nameSearch = nameCharacter
    fetchCharacters(currentPage, nameSearch)
    search = true
})

//fetch characters
async function fetchCharacters(page, characterName) {
    try {

        const params = {
            page
        }

        let response = ''
        if (search === false) {
            response = await api.get(`/character`, { params })

        } else if (search === true) {
            response = await api.get(`/character/?name=${characterName}`, { params })
        }

        const character = response.data.results
        totalPages = response.data.info.pages
        containerCard.innerHTML = ''

        character.forEach(async character => {
            const characterCard = document.createElement('article')
            characterCard.classList.add('cardstyle')
            characterCard.classList.add('fade-in')
            characterCard.setAttribute('data-bs-toggle', 'modal')
            characterCard.setAttribute('data-bs-target', '#exampleModal')
            characterCard.addEventListener('click', () => {
                let characterId = character.id
                console.log(characterId)
                return createModal(characterId)
            })

            let lastEpisode = character.episode.length

            let statusCharacter = ''
            if (character.status === 'Alive') {
                statusCharacter = 'Vivo'
            } else if (character.status === 'Dead') {
                statusCharacter = 'Morto'
            } else if (character.status === 'unknown') {
                statusCharacter = 'Desconhecido'
            }

            characterCard.innerHTML = `
                <img class="img-character slide-in-fwd-center" src="${character.image}" alt="Image of character">
                <div class="info-character">
                    <div>
                        <h3 class="character-title slide-in-fwd-center">${character.name}</h3>
                        <span class="character-sub-title slide-in-fwd-center"><span class="status-character ${statusCharacter}"></span>${statusCharacter} - ${character.species}</h3>
                    </div>
                <div>
                    <p class="slide-in-fwd-center">Última localização conhecida:</p>
                    <h3 class="character-sub-title slide-in-fwd-center">${character.location.name}</h3>
                </div>
                <div>
                    <p class="slide-in-fwd-center">Visto a última vez em:</p>
                    <h3 class="character-sub-title slide-in-fwd-center">${await getLastEpisode(lastEpisode)}</h3>
                </div>
        `
            containerCard.appendChild(characterCard)
        })
        if (character.length === 0) {
            const h3 = document.createElement('h3')
            h3.textContent = 'Nenhum personagem encontrado.'
            containerCard.appendChild(h3)
        }
    } catch (e) {
        console.log('Error', e)
    }
}

fetchCharacters(currentPage, nameSearch)

//createModal
async function createModal(id) {
    const response = await api.get(`/character/${id}`);
    const characterById = response.data
    const modalContent = document.querySelector('.modal-content')
    let lastEpisodeById = characterById.episode.length

    let statusCharacterById = ''
    if (characterById.status === 'Alive') {
        statusCharacterById = 'Vivo'
    } else if (characterById.status === 'Dead') {
        statusCharacterById = 'Morto'
    } else if (characterById.status === 'unknown') {
        statusCharacterById = 'Desconhecido'
    }

    modalContent.innerHTML = `
        <div class="modal-header d-flex justify-content-center">
        <img class="img-character-modal slide-in-fwd-center " src="${characterById.image}" alt="Image of character">
        </div>
            <div class="modal-body">
        <div>
            <h3 class="character-title-modal slide-in-fwd-center">${characterById.name}</h3>
            <span class="character-sub-title-modal slide-in-fwd-center"><span class="status-character-modal ${statusCharacterById}"></span>${statusCharacterById} - ${characterById.species}</h3>
        </div>
        <div class="mt-2">
            <p class="mb-0 slide-in-fwd-center">Última localização conhecida:</p>
            <h3 class="character-sub-title-modal slide-in-fwd-center">${characterById.location.name}</h3>
        </div>
        <div class="mt-2">
            <p class="mb-0 slide-in-fwd-center">Visto a última vez em:</p>
            <h3 class="character-sub-title-modal slide-in-fwd-center">${await getLastEpisode(lastEpisodeById)}</h3>
        </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Fechar</button>
        </div>
    `
}

//fetch informations footer
async function fectchInformations() {
    try {
        const characters = await api.get(`/character`)
        const locations = await api.get(`/location`)
        const episodes = await api.get(`/episode`)
        const infoApi = document.getElementById('info-api')

        infoApi.innerHTML += `
            <div class="col-12 col-md-3 col-xl-2 text-center ">
                <p class="info-text fade-in">PERSONAGENS: ${characters.data.info.count}</p>
            </div>
            <div class="col-12 col-md-3 col-xl-2 text-center">
                <p class="info-text fade-in">LOCALIZAÇÕES: ${locations.data.info.count}</p>
            </div>
            <div class="col-12 col-md-3 col-xl-2 text-center">
                <p class="info-text fade-in">EPISÓDIOS: ${episodes.data.info.count}</p>
            </div>
            `
    } catch (e) {
        console.log('Error', e)
    }
}

fectchInformations()

//events for prev and next page
prevPage.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--
        fetchCharacters(currentPage, nameSearch)
    }
})

nextPage.addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        fetchCharacters(currentPage, nameSearch)
    }
})
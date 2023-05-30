

if(document.querySelector(".containerClips")) {
    const clips = document.querySelector('.clips');
    
    const fetchClips = async () => {
        const url = `https://youtube-v38.p.rapidapi.com/search/?q=zevent%202022&hl=en&gl=US`;
        
        const options = {
            method: "GET",
            headers: {
                "X-RapidAPI-Key": "84399774d8msh03fec11226282dcp1b3a76jsnd208acdc0545",
                "X-RapidAPI-Host": "youtube-v38.p.rapidapi.com"
            }
        };
        const response = await fetch(url, options);
        const { contents, estimatedResults } = await response.json();
        for(let i = 0 ; i < contents.length ; i++) {
               const idVideo = contents[i].video.videoId;
               fetchClip(idVideo);            
        }
        
        
    }
    
    const fetchClip = async (idVideo) => {
        const url = `https://youtube-v38.p.rapidapi.com/video/details/?id=${idVideo}&hl=en&gl=US`;
        const options = {
            method: "GET",
            headers: {
                "X-RapidAPI-Key": "84399774d8msh03fec11226282dcp1b3a76jsnd208acdc0545",
                "X-RapidAPI-Host": "youtube-v38.p.rapidapi.com"
            }
        };
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result)
        // const { author, publishedDate, stats, thumbnails, title } = await response.json();
        // console.log(publishedDate)
        // clips.innerHTML = `
        //     <article>
        //        <video controls poster="${thumbnails[0].url}">
        //             Ce format ne peut être lu par votre navigateur.
        //             <source src="https://www.youtube.com/watch?v=${videoId}" />
        //         </video>
        //        <div class="description">
        //              <div class="viewAndDate">
        //                  <span>${stats.views}</span>
        //                 <span>${publishedDate}</span>
        //             </div>
        //             <div class="avatarAndTitle">
        //                 <a href="https://www.youtube.com${author.canonicalBaseUrl}">
        //                     <img src="${author.avatar[0].url}" alt="avatar youtube de ${author.title}" />
        //                 </a>
        //                 <h2>${title}</h2>
        //             </div>
        //             <div class=""nameStreamerAndActivity">
        //                 <strong>${author.title}</strong> - Spécial Event
        //             </div>
        //         </div>
            
        //      </article>
        
        //  `;        
        
    }

    fetchClips();
}
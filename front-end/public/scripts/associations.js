if(document.querySelector('.buttonTabs'))
{
    /* Tabs */
    const buttons = document.querySelectorAll('.buttonTabs button');
    const sections = document.querySelectorAll('.contentTabs section');

    for (let i = 0 ; i < buttons.length ; i++)
    {
        buttons[i].addEventListener('click', () => {
            
            if(!sections[i].classList.contains('activeTabs'))
            {
                sections.forEach(section => {
                    
                    section.classList.remove('activeTabs');
        
                });

                sections[i].classList.add('activeTabs');
            }

        });
    }
}
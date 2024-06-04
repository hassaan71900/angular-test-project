/// <reference types="cypress" />

describe('Test with backend',()=>{

beforeEach('login to the application',()=>{
  
    cy.intercept('GET','**tags',{fixture:'tags.json'}).as('getTags')
    cy.loginToApplication();
    
})


// it('should log in',()=>{
//     cy.log('yey we logged in')
// })

it.skip('Verify correct request and response',()=>{


    const randomString = (length) => {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
    
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    };

    const title = randomString(10);
    const description = randomString(30);
    const body = randomString(50);


    // cy.intercept()
cy.intercept('POST', '**/articles').as('postArticles')             // use endpoints and save this call in save articles object
    cy.contains('New Article').click()
    
    cy.get('[formcontrolname="title"]').type(title)
    cy.get('[formcontrolname="description"]').type(description)
    cy.get('[formcontrolname="body"]').type(body)
    cy.contains('Publish Article').click()

    cy.wait('@postArticles') // waited on response and use this alias and calling alias  
    cy.get('@postArticles').then(xhr=>{      // and do whatever we need to do 
        console.log(xhr)
       expect(xhr.status).to.equal(200)
       expect(xhr.request.body.article.body).to.equal('This is the body of the article')

    })
})

it('Should give tags with routing object',()=>{
    cy.wait('@getTags')
     cy.get('.tag-list')
     .should('contain','cypress')
     .and('contain','Automation')
     .and('contain','Testing')


    })


    it('Verify global feed likes count',()=>{
        cy.intercept('GET','**/articles/feed*',{"articles":[],"articlesCount":0})
        cy.intercept('GET','**/articles*',{fixture:'articles.json'}).as('getcount')    // use * after end points to get into files 
    
        cy.contains('Global Feed').click()

    cy.get('app-article-list button').then(listOfbuttons =>{
        expect(listOfbuttons[0]).to.contain('4')
        expect(listOfbuttons[1]).to.contain('6')


    })


    cy.fixture('articles').then(file=>{
        const articlesLink=file.articles[1].slug
        cy.intercept('POST','**/articles/'+articlesLink+'/favorite',file)  //articles is object
    })
    cy.get('app-article-list button')
    .eq(1)
    .click()
    .should('contain','7')
    })
    


})

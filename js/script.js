'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  postTagLink: Handlebars.compile(document.querySelector('#template-post-tag-link').innerHTML),
  postAuthorLink: Handlebars.compile(document.querySelector('#template-post-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud').innerHTML),
  authorList: Handlebars.compile(document.querySelector('#template-author-list').innerHTML)
};
function titleClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked');

  /* [DONE] remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');

  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }
  /* [DONE] add class 'active' to the clicked link */
  clickedElement.classList.add('active');
  /* [DONE] remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts .post.active');
  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }
  /* [DONE] get 'href' attribute from the clicked link */
  const clickedHref = clickedElement.getAttribute('href');
  
  /* [DONE] find the correct article using the selector (value of 'href' attribute) */
  const article = document.querySelector(clickedHref);
  /* [DONE] add class 'active' to the correct article */
  article.classList.add('active');
}

function authorClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  const authorsList = document.querySelectorAll('.list.authors a');
  for(let authorLink of authorsList){
    authorLink.classList.remove('active');
  }
  clickedElement.classList.add('active');
  const href = clickedElement.getAttribute('href');
  let author = href.replace('#','');
  author = author.replace('-',' ');
  generateTitleLinks('[data-author="' + author + '"]');
}

function tagClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  /* find all tag links with class active */
  const activeLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  /* START LOOP: for each active tag link */
  for(let activeLink of activeLinks){
    /* remove class active */
    activeLink.classList.remove('active');
  /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const equalTags = document.querySelectorAll('[href^="' + href + '"]');
  /* START LOOP: for each found tag link */
  for(let equalTag of equalTags){
    /* add class active */
    equalTag.classList.add('active');
  /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}


const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author',
  optTagsListSelector = '.tags.list',
  optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-',
  optAuthorListSelector = '.list.authors';

function generateTitleLinks(customSelector = ''){
  /* [DONE] remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML='';
  /* [DONE] for each article */
  let html = '';
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  for(let article of articles){
    /* [DONE] get the article id */
    const articleId = article.getAttribute('id');
    /* [DONE] get the title from the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    /* [DONE] create HTML of the link */
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    /* [DONE] insert link into titleList */
    html = html + linkHTML;
  }
  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');

  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}
generateTitleLinks();

function calculateTagsParams(tags){
  let tagCount = [];
  let max, min;

  for(let tag in tags){
    tagCount.push(tags[tag]);
  }
  max = Math.max.apply(null, tagCount);
  min = Math.min.apply(null, tagCount);

  return {
    min: min,
    max: max
  };
}

function calculateTagClass(count,params){
  //Divide maximal occurance number by the number of created tag-size- SCSS classes (in this case: 4).
  const number = params.max / 4;
  let classHTML;
  if(count <= number){
    classHTML = optCloudClassPrefix + 1;
  }
  else if(count <= number * 2){
    classHTML = optCloudClassPrefix + 2;
  }
  else if(count <= number * 3){
    classHTML = optCloudClassPrefix + 3;
  }
  else if(count <= number * 4){
    classHTML = optCloudClassPrefix + 4;
  }
  
  return classHTML;
}

function generateTags(){
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /* START LOOP: for every article: */
  for(let article of articles){
    /* find tags wrapper */
    const tagsWrapper = article.querySelector(optArticleTagsSelector);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    /* START LOOP: for each tag */
    for(let tag of articleTagsArray){
      /* generate HTML of the link */
      const linkHTMLData = {tag: tag};
      const linkHTML = templates.postTagLink(linkHTMLData);
      /* add generated code to html variable */
      html = html + ' ' + linkHTML;
      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags.hasOwnProperty(tag)){
        /* [NEW] add generated code to allTags object */
        allTags[tag] = 1;
      }
      else{
        allTags[tag]++;
      }
    /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */ 
    tagsWrapper.innerHTML = html;
  /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector('.tags');
  
  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams:', tagsParams);

  const allTagsData = {tags:[]};

  for (let tag in allTags){
    
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
  }

  tagList.innerHTML = templates.tagCloudLink(allTagsData);
  console.log(allTagsData);
}
generateTags();

function generateAuthors(){
  const articles = document.querySelectorAll(optArticleSelector);
  const authorList = document.querySelector(optAuthorListSelector);
  const allAuthorsData = {authors: []};
  let authorsArray = [];
  for(let article of articles){
    const author = article.getAttribute('data-author');
    const authorWrapper = article.querySelector(optArticleAuthorSelector);
    let html = authorWrapper.innerHTML;
    const authorTag = author.replace(' ','-');
    const linkHTMLData = {tag: authorTag, name: author};
    const linkHTML = templates.postAuthorLink(linkHTMLData);
    html = html + linkHTML;
    authorWrapper.innerHTML = html;
    if(authorsArray.indexOf(author) == -1){
      authorsArray.push(author);
    }
  }
  for(let author of authorsArray){
    allAuthorsData.authors.push({tag: author.replace(' ','-'), name: author});
  }
  authorList.innerHTML = templates.authorList(allAuthorsData);
}

generateAuthors();

function addClickListenersToTags(){
  /* find all links to tags */
  const tagLinks = document.querySelectorAll('.list-horizontal a, .list.tags a');
  /* START LOOP: for each link */
  for(let tagLink of tagLinks){
    /* add tagClickHandler as event listener for that link */
    tagLink.addEventListener('click', tagClickHandler);
  /* END LOOP: for each link */
  }
}

addClickListenersToTags();

function addClickListenersToAuthors(){
  const authorLinks = document.querySelectorAll('.post-author a, .list.authors a');
  for(let authorLink of authorLinks){
    authorLink.addEventListener('click', authorClickHandler);
  }
}

addClickListenersToAuthors();

//Delete class active from all links if ALL POSTS button is clicked.
const allPosts = document.querySelector('h2 a');

allPosts.addEventListener('click', function(){
  const authorList = document.querySelectorAll('.list a');
  for(let authorlink of authorList){
  authorlink.classList.remove('active');
  }
})
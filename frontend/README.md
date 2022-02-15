# Remember to be in ./frontend directory run frontend.

### Install all dependencies:
`npm install` 
### Run Frontend on localhost: 
`npm run dev`

Running with `nmp run dev` automatically refreshes app with new chenges in code.

# Adding new features on frontend
### To add new feature go to `MainContext.jsx`, create new `div` with `className='sectionX'`, add component inside created `div` and add new section in `mainContext.css`. Example for x=2:
```html
<div className="section1">
    <h2>Mint NFT</h2>
        <MintNFT /> <!-- component with logic -->
</div>
```
```css
.container{
    /* other properties */
    grid-template-areas:
      "section1 section1 section1" /* old */
      "section2 section2 section2"; /* added */
}
.section1 { grid-area: section1; } /* old */
.section2 { grid-area: section2; } /* added */
```
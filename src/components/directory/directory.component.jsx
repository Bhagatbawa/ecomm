import CategoryItem from '../category-item/category-item.component';

import './directory.styles.scss';
const Directory = ({Categories}) => {
    return  (
    <div className = 'directory-container'>
      {Categories.map((category) => (
    <CategoryItem key={category.id} category={category} />
    ))}
     </div>
    );
}

export default Directory;

    
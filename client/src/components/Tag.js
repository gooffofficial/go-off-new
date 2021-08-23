import styles from './styles/Tag.module.scss';
// Pass in text when instantiating - <Tag text='Eco-Friendly' />
// TO-DO : Add link to view similar tags

const Tag = (props) => {
	const { text } = props;

	return (
		<div className={styles.tagContainer}>
			<p className={styles.tagText}>{text}</p>
		</div>
	);
};

export default Tag;

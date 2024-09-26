const Spinner = ({buttonName}) => (
    <div>
        <button class="btn btn-info btn-block" type="button" disabled>
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            {" "}
            {buttonName}
        </button>
    </div>
)

export default Spinner
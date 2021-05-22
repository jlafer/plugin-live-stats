import React from "react";

/*
  Example Usage:
  			<SideLink
				{...this.props}
				icon={<StatsButtonIcon />}
				iconActive={<StatsButtonIconActive />}
				isActive={this.props.activeView === "stats-page"}
				onClick={this.handleClick}
			>
				Custom Page Nav
			</SideLink>
*/
export const StatsButtonIconActive = props => {
  return (
    <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
      <defs />
      <g
        id="24px/Comms/Pos/IcnMyBold"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <rect id="Rectangle-2" x="0" y="0" width="24" height="24" />
        <g
          id="Group"
          transform="translate(4.000000, 5.000000)"
          fill="currentColor"
          fillRule="nonzero"
        >
          <path
            d="M7,8 L12,8 C12.5522847,8 13,8.44771525 13,9 L13,13 C13,13.5522847 12.5522847,14 12,14 L7,14 C6.44771525,14 6,13.5522847 6,13 L6,9 C6,8.44771525 6.44771525,8 7,8 Z"
            id="Rectangle-5"
          />
          <path
            d="M14,10 C14,9.1920166 14,8.53125846 14,8.01772557 C14,7.50419268 13.6666667,7.16495082 13,7 C13,5.85900879 12.6673584,5.03114827 12.0020752,4.51641846 C11.6677739,4.25776947 11.3363854,4.08562999 11.0079097,4 L15,4 L15,2 L1,2 L1,4 L8.23919323,4 C7.83083469,4.08067068 7.41777028,4.29742686 7,4.65026855 C6.33447266,5.21236165 6.00170898,5.99560547 6.00170898,7 C5.33390299,7.12865525 5,7.4678971 5,8.01772557 C5,8.56755403 5,9.22831217 5,10 L1,10 C0.44771525,10 0,9.55228475 0,9 L0,1 C0,0.44771525 0.44771525,0 1,0 L15,0 C15.5522847,0 16,0.44771525 16,1 L16,9 C16,9.55228475 15.5522847,10 15,10 L14,10 Z M10.0410625,4 L8.96044978,4 L10.0408325,4.00006104 Z"
            id="Combined-Shape"
          />
        </g>
        <path
          d="M12.75,11 C12.3357864,11 12,11.3357864 12,11.75 L12,13.25 C12,13.6642136 12.3357864,14 12.75,14 L14.25,14 C14.6642136,14 15,13.6642136 15,13.25 L15,11.75 C15,11.3357864 14.6642136,11 14.25,11 L12.75,11 Z M12.875,10 L14.125,10 C15.1605339,10 16,10.8981348 16,12.0060403 L16,13.3434005 L14.125,14 L12.875,14 L11,13.3434005 L11,12.0060403 C11,10.8981348 11.8394661,10 12.875,10 Z"
          id="Rectangle-21"
          fill="currentColor"
          fillRule="nonzero"
        />
      </g>
    </svg>
  );
};

export const StatsButtonIcon = props => {
  return (
    <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
      <defs />
      <g id="24px/Comms/Pos/IcnMy" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <rect id="Rectangle-2" x="0" y="0" width="24" height="24" />
        <g id="Group" transform="translate(4.000000, 5.000000)">
          <rect
            id="Rectangle-5"
            stroke="currentColor"
            x="6.5"
            y="8.5"
            width="6"
            height="5"
            rx="1"
          />
          <rect id="Rectangle-4" fill="currentColor" x="1" y="2" width="14" height="2" />
          <path
            d="M1,1 L1,9 L15,9 L15,1 L1,1 Z M14,10 L14,9 L5,9 L5,10 L1,10 C0.44771525,10 0,9.55228475 0,9 L0,1 C0,0.44771525 0.44771525,0 1,0 L15,0 C15.5522847,0 16,0.44771525 16,1 L16,9 C16,9.55228475 15.5522847,10 15,10 L14,10 Z"
            id="Combined-Shape"
            fill="currentColor"
            fillRule="nonzero"
          />
        </g>
        <path
          d="M12.75,11 C12.3357864,11 12,11.3357864 12,11.75 L12,13.25 C12,13.6642136 12.3357864,14 12.75,14 L14.25,14 C14.6642136,14 15,13.6642136 15,13.25 L15,11.75 C15,11.3357864 14.6642136,11 14.25,11 L12.75,11 Z M12.875,10 L14.125,10 C15.1605339,10 16,10.8981348 16,12.0060403 L16,13.3434005 L14.125,14 L12.875,14 L11,13.3434005 L11,12.0060403 C11,10.8981348 11.8394661,10 12.875,10 Z"
          id="Rectangle-21"
          fill="currentColor"
          fillRule="nonzero"
        />
      </g>
    </svg>

  );
};

export default StatsButtonIcon;